package categories

import "database/sql"

type Repository interface {
	FetchAll(offset, limit int) ([]Category, int, error)
	Create(c Category) error
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository { return &repository{db} }

func (r *repository) FetchAll(offset, limit int) ([]Category, int, error) {
	var total int
	r.db.QueryRow(`SELECT COUNT(*) FROM categories`).Scan(&total)

	rows, err := r.db.Query(`SELECT id, name FROM categories LIMIT ? OFFSET ?`, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var res []Category
	for rows.Next() {
		var c Category
		rows.Scan(&c.ID, &c.Name)
		res = append(res, c)
	}
	return res, total, nil
}

func (r *repository) Create(c Category) error {
	_, err := r.db.Exec(`INSERT INTO categories (name) VALUES (?)`, c.Name)
	return err
}
