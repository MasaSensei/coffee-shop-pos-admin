package menu_variants

import "database/sql"

type Repository interface {
	Create(mv MenuVariant) (int, error)
	FetchByMenu(menuID int) ([]MenuVariant, error)
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository { return &repository{db} }

func (r *repository) Create(mv MenuVariant) (int, error) {
	query := `INSERT INTO menu_variants (menu_id, variant_name, price, sku) VALUES (?, ?, ?, ?)`
	res, err := r.db.Exec(query, mv.MenuID, mv.VariantName, mv.Price, mv.SKU)
	if err != nil {
		return 0, err
	}
	id, _ := res.LastInsertId()
	return int(id), nil
}

func (r *repository) FetchByMenu(menuID int) ([]MenuVariant, error) {
	rows, err := r.db.Query(`SELECT id, menu_id, variant_name, price, sku FROM menu_variants WHERE menu_id = ?`, menuID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var res []MenuVariant
	for rows.Next() {
		var mv MenuVariant
		rows.Scan(&mv.ID, &mv.MenuID, &mv.VariantName, &mv.Price, &mv.SKU)
		res = append(res, mv)
	}
	return res, nil
}
