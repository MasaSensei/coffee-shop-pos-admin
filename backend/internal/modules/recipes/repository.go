package recipes

import "database/sql"

type Repository interface {
	FetchByVariant(variantID int) ([]Recipe, error)
	Create(r Recipe) error
	DeleteByVariant(variantID int) error
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository { return &repository{db} }

func (r *repository) FetchByVariant(variantID int) ([]Recipe, error) {
	rows, err := r.db.Query(`SELECT id, menu_variant_id, ingredient_id, quantity_needed FROM recipes WHERE menu_variant_id = ?`, variantID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var res []Recipe
	for rows.Next() {
		var rc Recipe
		rows.Scan(&rc.ID, &rc.MenuVariantID, &rc.IngredientID, &rc.QuantityNeeded)
		res = append(res, rc)
	}
	return res, nil
}

func (r *repository) Create(rc Recipe) error {
	_, err := r.db.Exec(`INSERT INTO recipes (menu_variant_id, ingredient_id, quantity_needed) VALUES (?, ?, ?)`,
		rc.MenuVariantID, rc.IngredientID, rc.QuantityNeeded)
	return err
}

func (r *repository) DeleteByVariant(variantID int) error {
	_, err := r.db.Exec(`DELETE FROM recipes WHERE menu_variant_id = ?`, variantID)
	return err
}
