package menus

import "database/sql"

type Repository interface {
	Fetch(offset, limit int) ([]Menu, int, error)
	Create(m Menu) (int, error)
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository { return &repository{db} }

func (r *repository) Fetch(offset, limit int) ([]Menu, int, error) {
	var total int
	r.db.QueryRow(`SELECT COUNT(*) FROM menus`).Scan(&total)

	rows, err := r.db.Query(`SELECT id, category_id, name, description, is_active FROM menus LIMIT ? OFFSET ?`, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var res []Menu
	for rows.Next() {
		var m Menu
		rows.Scan(&m.ID, &m.CategoryID, &m.Name, &m.Description, &m.IsActive)
		res = append(res, m)
	}
	return res, total, nil
}

func (r *repository) Create(m Menu) (int, error) {
	res, err := r.db.Exec(`INSERT INTO menus (category_id, name, description, is_active) VALUES (?, ?, ?, ?)`,
		m.CategoryID, m.Name, m.Description, m.IsActive)
	if err != nil {
		return 0, err
	}
	id, _ := res.LastInsertId()
	return int(id), nil
}
