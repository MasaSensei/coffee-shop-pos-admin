package sales

import (
	"context"
	"database/sql"
	"fmt"
)

type Repository interface {
	CreateTransaction(ctx context.Context, t Transaction) (int, error)
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository { return &repository{db} }

func (r *repository) CreateTransaction(ctx context.Context, t Transaction) (int, error) {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return 0, err
	}
	defer tx.Rollback()

	// 1. Simpan Header Transaksi
	queryT := `INSERT INTO transactions (
    invoice_no, queue_number, shift_id, user_id, customer_id, 
    payment_method_id, order_source, order_type, subtotal, 
    tax_amount, discount_amount, grand_total, amount_paid, 
    change_amount, status, payment_reference, qr_string
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	res, err := tx.ExecContext(ctx, queryT,
		t.InvoiceNo, t.QueueNumber, t.ShiftID, t.UserID, t.CustomerID,
		t.PaymentMethodID, t.OrderSource, t.OrderType, t.Subtotal,
		t.TaxAmount, t.DiscountAmount, t.GrandTotal, t.AmountPaid,
		t.ChangeAmount, t.Status, t.PaymentReference, t.QRString)
	if err != nil {
		return 0, err
	}

	tID, _ := res.LastInsertId()

	// 2. Loop Items untuk Simpan dan Potong Stok
	for _, item := range t.Items {
		// A. Simpan Item Transaksi
		_, err = tx.ExecContext(ctx,
			"INSERT INTO transaction_items (transaction_id, menu_variant_id, qty, price_at_sale, cost_at_sale) VALUES (?, ?, ?, ?, ?)",
			tID, item.MenuVariantID, item.Qty, item.PriceAtSale, item.CostAtSale)
		if err != nil {
			return 0, err
		}

		// B. LOGIC POTONG STOK: Cari resep untuk variant ini
		rows, err := tx.QueryContext(ctx, "SELECT ingredient_id, quantity_needed FROM recipes WHERE menu_variant_id = ?", item.MenuVariantID)
		if err != nil {
			return 0, err
		}

		// Kita butuh slice sementara untuk menampung resep agar tidak lock connection
		type recipeInfo struct {
			ingID int
			qty   float64
		}
		var recipes []recipeInfo
		for rows.Next() {
			var ri recipeInfo
			rows.Scan(&ri.ingID, &ri.qty)
			recipes = append(recipes, ri)
		}
		rows.Close()

		// C. Eksekusi Potong Stok
		for _, recipe := range recipes {
			totalNeeded := recipe.qty * float64(item.Qty)

			// Update stok dengan check (Jangan sampai stok jadi negatif jika tidak diizinkan)
			result, err := tx.ExecContext(ctx,
				"UPDATE ingredients SET stock_qty = stock_qty - ? WHERE id = ? AND stock_qty >= ?",
				totalNeeded, recipe.ingID, totalNeeded)

			if err != nil {
				return 0, err
			}

			rowsAffected, _ := result.RowsAffected()
			if rowsAffected == 0 {
				return 0, fmt.Errorf("stok bahan tidak mencukupi untuk variant_id: %d", item.MenuVariantID)
			}

			queryHistory := `INSERT INTO stock_history (ingredient_id, type, quantity, reference_id) 
                     VALUES (?, 'SALE', ?, ?)`
			_, err = tx.ExecContext(ctx, queryHistory, recipe.ingID, -totalNeeded, tID)
			if err != nil {
				return 0, err
			}
		}
	}

	return int(tID), tx.Commit()
}
