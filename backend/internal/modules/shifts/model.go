package shifts

import "time"

type Shift struct {
	ID        int        `json:"id"`
	UserID    int        `json:"user_id"`
	OutletID  int        `json:"outlet_id"`
	StartTime time.Time  `json:"start_time"`
	EndTime   *time.Time `json:"end_time"`
	StartCash float64    `json:"start_cash"` // Modal awal di laci kasir
	EndCash   *float64   `json:"end_cash"`   // Total uang saat tutup shift
}

type CloseShiftInput struct {
	ShiftID int     `json:"shift_id"`
	EndCash float64 `json:"end_cash"` // Uang fisik yang dihitung kasir
}

type ShiftSummary struct {
	ID            int     `json:"id"`
	OpeningCash   float64 `json:"opening_cash"`
	TotalSales    float64 `json:"total_sales"`
	ExpectedCash  float64 `json:"expected_cash"` // Opening + Total Sales
	ActualEndCash float64 `json:"actual_end_cash"`
	Difference    float64 `json:"difference"` // Selisih (jika ada)
}
