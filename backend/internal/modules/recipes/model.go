package recipes

type Recipe struct {
	ID           int     `json:"id"`
	MenuID       int     `json:"menu_id"`
	IngredientID int     `json:"ingredient_id"`
	QtyNeeded    float64 `json:"quantity_needed"`
}
