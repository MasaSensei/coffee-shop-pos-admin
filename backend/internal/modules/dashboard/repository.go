package dashboard

import (
	"context"
	"database/sql"
)

type Repository interface {
	GetStats(ctx context.Context) (map[string]interface{}, error)
}

type repository struct{ db *sql.DB }

func NewRepository(db *sql.DB) Repository { return &repository{db} }

func (r *repository) GetStats(ctx context.Context) (map[string]interface{}, error) {
	var totalRevenue float64
	var totalOrders int

	// 1. Hitung Total Omzet (Hanya yang PAID)
	r.db.QueryRowContext(ctx, "SELECT COALESCE(SUM(grand_total), 0), COUNT(id) FROM transactions WHERE status = 'PAID'").Scan(&totalRevenue, &totalOrders)

	// 2. Ambil Stok Kritis (Contoh: stok di bawah 10 unit)
	var lowStockCount int
	r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM ingredients WHERE stock_qty <= 10").Scan(&lowStockCount)

	return map[string]interface{}{
		"total_revenue":    totalRevenue,
		"completed_orders": totalOrders,
		"low_stock_count":  lowStockCount,
	}, nil
}
