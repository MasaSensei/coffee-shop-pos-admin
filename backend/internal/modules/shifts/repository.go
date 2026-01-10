package shifts

import (
	"context"
	"database/sql"
	"fmt"
)

type Repository interface {
	OpenShift(ctx context.Context, s Shift) (int, error)
	GetActiveShift(ctx context.Context, userID int) (*Shift, error)
	CloseShift(ctx context.Context, s CloseShiftInput) (*ShiftSummary, error)
}

type repository struct{ db *sql.DB }

func NewRepository(db *sql.DB) Repository { return &repository{db} }

func (r *repository) OpenShift(ctx context.Context, s Shift) (int, error) {
	// 1. Validasi Shift Aktif
	var count int
	r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM shifts WHERE user_id = ? AND end_time IS NULL", s.UserID).Scan(&count)
	if count > 0 {
		return 0, fmt.Errorf("user masih memiliki shift aktif yang belum ditutup")
	}

	// 2. Perbaikan Query INSERT (Tambahkan outlet_id)
	// Pastikan nama kolom di DB adalah 'opening_cash' atau 'start_cash' sesuai migrasimu
	query := `INSERT INTO shifts (user_id, outlet_id, opening_cash, opened_at) 
              VALUES (?, ?, ?, CURRENT_TIMESTAMP)`

	res, err := r.db.ExecContext(ctx, query, s.UserID, s.OutletID, s.StartCash)
	if err != nil {
		return 0, fmt.Errorf("gagal insert shift: %v", err)
	}

	id, _ := res.LastInsertId()
	return int(id), nil
}

func (r *repository) GetActiveShift(ctx context.Context, userID int) (*Shift, error) {
	var s Shift
	err := r.db.QueryRowContext(ctx, "SELECT id, user_id, start_time, opening_cash FROM shifts WHERE user_id = ? AND end_time IS NULL", userID).
		Scan(&s.ID, &s.UserID, &s.StartTime, &s.StartCash)

	if err != nil {
		return nil, err
	}
	return &s, nil
}

func (r *repository) CloseShift(ctx context.Context, s CloseShiftInput) (*ShiftSummary, error) {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	// 1. Ambil modal awal dan pastikan shift masih buka
	var openingCash float64
	queryCheck := "SELECT opening_cash FROM shifts WHERE id = ? AND closed_at IS NULL"
	err = tx.QueryRowContext(ctx, queryCheck, s.ShiftID).Scan(&openingCash)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("shift ID %d tidak ditemukan atau sudah ditutup", s.ShiftID)
		}
		return nil, fmt.Errorf("database error: %v", err)
	}

	// 2. Hitung total penjualan tunai (PAID)
	var totalSales float64
	querySales := "SELECT COALESCE(SUM(grand_total), 0) FROM transactions WHERE shift_id = ? AND status = 'PAID'"
	err = tx.QueryRowContext(ctx, querySales, s.ShiftID).Scan(&totalSales)

	// Logika perhitungan rekonsiliasi
	expectedCash := openingCash + totalSales
	discrepancy := s.EndCash - expectedCash

	// 3. Update data penutupan menggunakan nama kolom yang SESUAI TABEL kamu
	queryUpdate := `
        UPDATE shifts 
        SET closed_at = CURRENT_TIMESTAMP, 
            actual_closing_cash = ?, 
            expected_closing_cash = ?,
            discrepancy = ?
        WHERE id = ?`

	_, err = tx.ExecContext(ctx, queryUpdate, s.EndCash, expectedCash, discrepancy, s.ShiftID)
	if err != nil {
		return nil, err
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return &ShiftSummary{
		ID:            s.ShiftID,
		OpeningCash:   openingCash,
		TotalSales:    totalSales,
		ExpectedCash:  expectedCash,
		ActualEndCash: s.EndCash,
		Difference:    discrepancy,
	}, nil
}
