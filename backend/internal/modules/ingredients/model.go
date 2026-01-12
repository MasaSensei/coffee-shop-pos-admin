package ingredients

type Ingredient struct {
	ID           int     `json:"id"`
	OutletID     int     `json:"outlet_id"`
	Name         string  `json:"name"`
	Unit         string  `json:"unit"`
	StockQty     float64 `json:"stock_qty"`
	AvgCostPrice float64 `json:"avg_cost_price"`
}

type StockHistory struct {
	ID             int     `json:"id"`
	IngredientID   int     `json:"ingredient_id"`
	IngredientName string  `json:"ingredient_name,omitempty"`
	Type           string  `json:"type"` // SALE, PURCHASE, WASTE, ADJUST
	Quantity       float64 `json:"quantity"`
	ReferenceID    int     `json:"reference_id"`
	CreatedAt      string  `json:"created_at"`
}
