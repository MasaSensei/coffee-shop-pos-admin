package shifts

import "time"

type Shift struct {
	ID          int
	UserID      int
	OpenedAt    time.Time
	ClosedAt    *time.Time
	OpeningCash float64
	ClosingCash *float64
	TotalSales  float64
}
