package outlet

import (
	"database/sql"
)

type Repository interface {
	Insert(o Outlet) (int64, error)
	FindAll(page, limit int) ([]Outlet, int, error)
	GetByID(id int) (*Outlet, error)
}

type repository struct {
	DB *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{DB: db}
}

func (r *repository) Insert(o Outlet) (int64, error) {
	query := `INSERT INTO outlets (name, address, phone, is_active) VALUES (?, ?, ?, 1)`
	res, err := r.DB.Exec(query, o.Name, o.Address, o.Phone)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

func (r *repository) FindAll(page, limit int) ([]Outlet, int, error) {
	var outlets []Outlet
	var total int

	// 1. Hitung total semua data (tanpa limit) untuk kebutuhan Meta
	err := r.DB.QueryRow("SELECT COUNT(*) FROM outlets").Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// 2. Ambil data dengan LIMIT dan OFFSET
	offset := (page - 1) * limit
	query := `SELECT id, name, address, phone, is_active FROM outlets LIMIT ? OFFSET ?`

	rows, err := r.DB.Query(query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	for rows.Next() {
		var o Outlet
		if err := rows.Scan(&o.ID, &o.Name, &o.Address, &o.Phone, &o.IsActive); err != nil {
			return nil, 0, err
		}
		outlets = append(outlets, o)
	}

	return outlets, total, nil
}

func (r *repository) GetByID(id int) (*Outlet, error) {
	var o Outlet
	query := `SELECT id, name, address, phone, is_active FROM outlets WHERE id = ?`
	err := r.DB.QueryRow(query, id).Scan(&o.ID, &o.Name, &o.Address, &o.Phone, &o.IsActive)
	if err != nil {
		return nil, err
	}
	return &o, nil
}
