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

// Tambahan untuk Staff/Barista
type Staff struct {
	ID     int    `json:"id"`
	Name   string `json:"name"`
	Role   string `json:"role"` // e.g., 'MANAGER', 'BARISTA'
	Avatar string `json:"avatar"`
}

// Tambahan untuk Riwayat Shift/Audit
type Shift struct {
	ID          int        `json:"id"`
	Barista     string     `json:"barista"`     // Dari JOIN users.name
	OpenedAt    time.Time  `json:"opened_at"`   // Sesuai tabel
	ClosedAt    *time.Time `json:"closed_at"`   // Gunakan pointer karena bisa NULL
	Discrepancy float64    `json:"discrepancy"` // Kolom selisih uang
	Note        string     `json:"note"`
}

// Struct Utama untuk Response Detail
type OutletDetailResponse struct {
	Outlet          // Embedding struct dasar
	Manager *Staff  `json:"manager"`
	Staffs  []Staff `json:"staffs"`
	Shifts  []Shift `json:"shifts"`
}

type CreateRequest struct {
	Name    string `json:"name"`
	Address string `json:"address"`
	Phone   string `json:"phone"`
}
