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
	// Hitung total kategori untuk pagination
	r.db.QueryRow(`SELECT COUNT(*) FROM categories`).Scan(&total)

	// Query dengan LEFT JOIN untuk menghitung menu per kategori
	query := `
        SELECT 
            c.id, 
            c.name, 
            COUNT(m.id) as total_menus
        FROM categories c
        LEFT JOIN menus m ON c.id = m.category_id
        GROUP BY c.id
        ORDER BY c.name ASC
        LIMIT ? OFFSET ?`

	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var res []Category
	for rows.Next() {
		var c Category
		// Scan total_menus ke field yang baru dibuat
		err := rows.Scan(&c.ID, &c.Name, &c.TotalMenus)
		if err != nil {
			return nil, 0, err
		}
		res = append(res, c)
	}
	return res, total, nil
}

func (r *repository) Create(c Category) error {
	_, err := r.db.Exec(`INSERT INTO categories (name) VALUES (?)`, c.Name)
	return err
}
