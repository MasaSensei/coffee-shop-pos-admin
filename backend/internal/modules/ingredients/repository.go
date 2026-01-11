package ingredients

import "database/sql"

type Repository interface {
	FetchAll(offset int, limit int) ([]Ingredient, int, error)
	FetchByOutlet(outletID int, offset int, limit int) ([]Ingredient, int, error)
	Create(i Ingredient) error
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{db}
}

func (r *repository) FetchAll(offset int, limit int) ([]Ingredient, int, error) {
	var total int
	r.db.QueryRow(`SELECT COUNT(*) FROM ingredients`).Scan(&total)

	query := `SELECT id, outlet_id, name, unit, stock_qty, avg_cost_price 
              FROM ingredients LIMIT ? OFFSET ?`

	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var res []Ingredient = []Ingredient{} // Inisialisasi slice kosong agar JSON tidak null
	for rows.Next() {
		var i Ingredient
		rows.Scan(&i.ID, &i.OutletID, &i.Name, &i.Unit, &i.StockQty, &i.AvgCostPrice)
		res = append(res, i)
	}
	return res, total, nil
}

func (r *repository) FetchByOutlet(outletID int, offset int, limit int) ([]Ingredient, int, error) {
	// 1. Query hitung total dulu (Penting untuk Meta Pagination)
	var total int
	err := r.db.QueryRow(`SELECT COUNT(*) FROM ingredients WHERE outlet_id = ?`, outletID).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// 2. Query ambil data dengan LIMIT & OFFSET
	query := `SELECT id, outlet_id, name, unit, stock_qty, avg_cost_price 
              FROM ingredients WHERE outlet_id = ? LIMIT ? OFFSET ?`

	rows, err := r.db.Query(query, outletID, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var res []Ingredient
	for rows.Next() {
		var i Ingredient
		// Gunakan scan yang presisi sesuai jumlah kolom di SELECT
		if err := rows.Scan(&i.ID, &i.OutletID, &i.Name, &i.Unit, &i.StockQty, &i.AvgCostPrice); err != nil {
			return nil, 0, err // Jangan lupa kembalikan 0 untuk total jika error
		}
		res = append(res, i)
	}

	// Pastikan return 3 nilai: slice data, total data, dan error
	return res, total, nil
}

func (r *repository) Create(i Ingredient) error {
	query := `INSERT INTO ingredients (outlet_id, name, unit, stock_qty, avg_cost_price) VALUES (?, ?, ?, ?, ?)`
	_, err := r.db.Exec(query, i.OutletID, i.Name, i.Unit, i.StockQty, i.AvgCostPrice)
	return err
}
