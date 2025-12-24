package ingredients

import "database/sql"

type Repository interface {
	Create(*Ingredient) error
	GetAll() ([]Ingredient, error)
	GetByID(id int) (*Ingredient, error)
	Update(*Ingredient) error
	Delete(id int) error
	GetStock(id int) (float64, error)
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{
		db: db,
	}
}

func (r *repository) Create(ing *Ingredient) error {
	_, err := r.db.Exec(`
		INSERT INTO ingredients (name, unit, cost_price)
		VALUES (?, ?, ?)
	`, ing.Name, ing.Unit, ing.CostPrice)
	return err
}

func (r *repository) GetAll() ([]Ingredient, error) {
	rows, err := r.db.Query(`
		SELECT id, name, unit, cost_price
		FROM ingredients
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Ingredient
	for rows.Next() {
		var ing Ingredient
		rows.Scan(&ing.ID, &ing.Name, &ing.Unit, &ing.CostPrice)
		list = append(list, ing)
	}

	return list, nil
}

func (r *repository) GetByID(id int) (*Ingredient, error) {
	row := r.db.QueryRow(`
		SELECT id, name, unit, cost_price
		FROM ingredients
		WHERE id = ?
	`, id)

	return scanIngredient(row)
}

func (r *repository) Update(ing *Ingredient) error {
	_, err := r.db.Exec(`
		UPDATE ingredients
		SET name = ?, unit = ?, cost_price = ?
		WHERE id = ?
	`, ing.Name, ing.Unit, ing.CostPrice, ing.ID)
	return err
}

func (r *repository) Delete(id int) error {
	_, err := r.db.Exec(`
		DELETE FROM ingredients
		WHERE id = ?
	`, id)
	return err
}

func (r *repository) GetStock(id int) (float64, error) {
	row := r.db.QueryRow(`
		SELECT stock_qty
		FROM ingredients
		WHERE id = ?
	`, id)

	var stock float64
	err := row.Scan(&stock)
	return stock, err
}

func scanIngredient(row *sql.Row) (*Ingredient, error) {
	var ing Ingredient
	err := row.Scan(&ing.ID, &ing.Name, &ing.Unit, &ing.CostPrice)
	return &ing, err
}
