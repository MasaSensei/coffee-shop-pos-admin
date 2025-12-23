package transactions

import "time"

type Transaction struct {
	ID        int       `json:"id"`
	ShiftID   int       `json:"shift_id"`
	UserID    int       `json:"user_id"`
	Total     float64   `json:"total"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
}
