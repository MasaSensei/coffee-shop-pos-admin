package user

import "time"

type User struct {
	ID           int        `json:"id"`
	OutletID     int        `json:"outlet_id"`
	Name         string     `json:"name"`
	Username     string     `json:"username"`
	Password     string     `json:"password,omitempty"` // omitempty agar password tidak muncul di response
	PasswordHash string     `json:"-"`                  // sama sekali tidak muncul di JSON
	Role         string     `json:"role"`
	IsActive     int        `json:"is_active"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    *time.Time `json:"updated_at"`
}

type RegisterRequest struct {
	OutletID int    `json:"outlet_id"`
	Name     string `json:"name"`
	Username string `json:"username"`
	Password string `json:"password"`
	Role     string `json:"role"`
}
