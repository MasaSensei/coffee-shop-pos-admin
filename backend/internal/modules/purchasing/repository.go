package purchasing

import (
	"context"
	"database/sql"
)

type Repository interface {
	CreateOrder(ctx context.Context, po PurchaseOrder) (int, error)
	FetchAll(ctx context.Context, offset, limit int) ([]PurchaseOrder, int, error)
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository { return &repository{db} }

func (r *repository) CreateOrder(ctx context.Context, po PurchaseOrder) (int, error) {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return 0, err
	}
	defer tx.Rollback()

	// 1. Insert Header
	queryPO := `INSERT INTO purchase_orders (supplier_id, user_id, outlet_id, po_number, total_cost, status) 
                VALUES (?, ?, ?, ?, ?, ?)`
	res, err := tx.ExecContext(ctx, queryPO, po.SupplierID, po.UserID, po.OutletID, po.PONumber, po.TotalCost, po.Status)
	if err != nil {
		return 0, err
	}
	poID, _ := res.LastInsertId()

	// 2. Insert Items & Update Stock/MAC
	queryItem := `INSERT INTO purchase_order_items (purchase_order_id, ingredient_id, qty_received, cost_per_unit, subtotal) 
                  VALUES (?, ?, ?, ?, ?)`

	for _, item := range po.Items {
		_, err := tx.ExecContext(ctx, queryItem, poID, item.IngredientID, item.QtyReceived, item.CostPerUnit, item.Subtotal)
		if err != nil {
			return 0, err
		}

		if po.Status == "RECEIVED" {
			// Logic MAC (Moving Average Cost) dengan proteksi division by zero
			updateStockQuery := `
				UPDATE ingredients 
				SET 
					avg_cost_price = CASE 
						WHEN (stock_qty + ?) <= 0 THEN ? 
						ELSE ((stock_qty * avg_cost_price) + (? * ?)) / (stock_qty + ?) 
					END,
					stock_qty = stock_qty + ? 
				WHERE id = ?`

			_, err = tx.ExecContext(ctx, updateStockQuery,
				item.QtyReceived, item.CostPerUnit, // CASE condition & default price
				item.QtyReceived, item.CostPerUnit, // New total cost
				item.QtyReceived, item.QtyReceived, // New total qty & stock add
				item.IngredientID)

			if err != nil {
				return 0, err
			}

			queryHistory := `INSERT INTO stock_history (ingredient_id, type, quantity, reference_id) 
                     VALUES (?, 'PURCHASE', ?, ?)`
			_, err = tx.ExecContext(ctx, queryHistory, item.IngredientID, item.QtyReceived, poID)
			if err != nil {
				return 0, err
			}
		}
	}

	return int(poID), tx.Commit()
}

func (r *repository) FetchAll(ctx context.Context, offset, limit int) ([]PurchaseOrder, int, error) {
	var total int
	r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM purchase_orders").Scan(&total)

	query := `SELECT id, supplier_id, user_id, po_number, status, total_cost, created_at 
			  FROM purchase_orders ORDER BY created_at DESC LIMIT ? OFFSET ?`

	rows, err := r.db.QueryContext(ctx, query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var results []PurchaseOrder
	for rows.Next() {
		var po PurchaseOrder
		rows.Scan(&po.ID, &po.SupplierID, &po.UserID, &po.PONumber, &po.Status, &po.TotalCost, &po.CreatedAt)
		results = append(results, po)
	}
	return results, total, nil
}
