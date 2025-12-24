package menus

import "database/sql"

type Repository interface {
	GetAll() ([]Menu, error)
	Create(m *Menu) error
	Update(m *Menu) error
	Delete(id int) error
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{
		db: db,
	}
}

func (r *repository) GetAll() ([]Menu, error) {
	rows, err := r.db.Query(`
		SELECT id, name, price, category_id, status, is_addon
		FROM menus
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Menu
	for rows.Next() {
		var m Menu
		rows.Scan(&m.ID, &m.Name, &m.Price, &m.CategoryID, &m.Status, &m.IsAddon)
		list = append(list, m)
	}

	return list, nil
}

func (r *repository) Create(m *Menu) error {
	_, err := r.db.Exec(`
		INSERT INTO menus (name, price, category_id, status, is_addon)
		VALUES (?, ?, ?, ?, ?)
	`, m.Name, m.Price, m.CategoryID, m.Status, m.IsAddon)
	return err
}

func (r *repository) Update(m *Menu) error {
	_, err := r.db.Exec(`
		UPDATE menus
		SET name = ?, price = ?, category_id = ?, status = ?, is_addon = ?
		WHERE id = ?
	`, m.Name, m.Price, m.CategoryID, m.Status, m.IsAddon, m.ID)
	return err
}

func (r *repository) Delete(id int) error {
	_, err := r.db.Exec(`
		DELETE FROM menus
		WHERE id = ?
	`, id)
	return err
}
