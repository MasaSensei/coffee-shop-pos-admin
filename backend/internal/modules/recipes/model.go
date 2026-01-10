package recipes

type Recipe struct {
	ID             int     `json:"id"`
	MenuVariantID  int     `json:"menu_variant_id"`
	IngredientID   int     `json:"ingredient_id"`
	QuantityNeeded float64 `json:"quantity_needed"`
}
