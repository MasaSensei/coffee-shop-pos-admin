package category

import "database/sql"

type Repository interface {
	GetAll() ([]Category, error)
	Create(name string) error
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{
		db: db,
	}
}

func (r *repository) GetAll() ([]Category, error) {
	rows, err := r.db.Query(`
		SELECT id, name
		FROM categories
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Category
	for rows.Next() {
		var c Category
		rows.Scan(&c.ID, &c.Name)
		list = append(list, c)
	}

	return list, nil
}

func (r *repository) Create(name string) error {
	_, err := r.db.Exec(`
		INSERT INTO categories (name)
		VALUES (?)
	`, name)
	return err
}
