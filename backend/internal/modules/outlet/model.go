package outlet

import (
	"database/sql"
	"time"
)

type Outlet struct {
	ID        int            `json:"id"`
	Name      string         `json:"name"`
	Address   string         `json:"address"`
	Phone     sql.NullString `json:"phone"`
	IsActive  int            `json:"is_active"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt *time.Time     `json:"updated_at"`
}

type CreateRequest struct {
	Name    string `json:"name"`
	Address string `json:"address"`
	Phone   string `json:"phone"`
}
