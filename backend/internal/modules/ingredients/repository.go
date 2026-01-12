package ingredients

import "database/sql"

type Repository interface {
	FetchAll(offset int, limit int) ([]Ingredient, int, error)
	FetchByOutlet(outletID int, offset int, limit int) ([]Ingredient, int, error)
	Create(i Ingredient) error
	UpdateStockTx(tx *sql.Tx, ingredientID int, qty float64, moveType string, refID int) error
	FetchHistory(ingredientID int) ([]StockHistory, error)
	FetchAllHistory(offset, limit int) ([]StockHistory, int, error)
	GetDB() *sql.DB
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{db}
}
func (r *repository) GetDB() *sql.DB { return r.db }

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

func (r *repository) UpdateStockTx(tx *sql.Tx, ingredientID int, qty float64, moveType string, refID int) error {
	// 1. Update Stock di table ingredients
	_, err := tx.Exec(`UPDATE ingredients SET stock_qty = stock_qty + ? WHERE id = ?`, qty, ingredientID)
	if err != nil {
		return err
	}

	// 2. Catat Log ke stock_history
	_, err = tx.Exec(`
		INSERT INTO stock_history (ingredient_id, type, quantity, reference_id) 
		VALUES (?, ?, ?, ?)`,
		ingredientID, moveType, qty, refID)
	return err
}

func (r *repository) FetchAllHistory(offset, limit int) ([]StockHistory, int, error) {
	var total int
	// Hitung total log untuk pagination
	r.db.QueryRow(`SELECT COUNT(*) FROM stock_history`).Scan(&total)

	// Query dengan JOIN untuk mendapatkan IngredientName
	query := `
        SELECT h.id, h.ingredient_id, i.name as ingredient_name, h.type, h.quantity, h.reference_id, h.created_at 
        FROM stock_history h
        JOIN ingredients i ON h.ingredient_id = i.id
        ORDER BY h.created_at DESC LIMIT ? OFFSET ?`

	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	res := []StockHistory{}
	for rows.Next() {
		var h StockHistory
		// Pastikan struct StockHistory punya field IngredientName
		err := rows.Scan(&h.ID, &h.IngredientID, &h.IngredientName, &h.Type, &h.Quantity, &h.ReferenceID, &h.CreatedAt)
		if err != nil {
			return nil, 0, err
		}
		res = append(res, h)
	}
	return res, total, nil
}

func (r *repository) FetchHistory(ingredientID int) ([]StockHistory, error) {
	query := `SELECT id, ingredient_id, type, quantity, reference_id, created_at 
	          FROM stock_history WHERE ingredient_id = ? ORDER BY created_at DESC`
	rows, err := r.db.Query(query, ingredientID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	res := []StockHistory{}
	for rows.Next() {
		var h StockHistory
		rows.Scan(&h.ID, &h.IngredientID, &h.Type, &h.Quantity, &h.ReferenceID, &h.CreatedAt)
		res = append(res, h)
	}
	return res, nil
}
