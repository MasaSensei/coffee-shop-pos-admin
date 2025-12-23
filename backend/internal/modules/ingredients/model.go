package ingredients

type Ingredient struct {
	ID       int     `json:"id"`
	Name     string  `json:"name"`
	Unit     string  `json:"unit"`
	StockQty float64 `json:"stock_qty"`
	MinStock float64 `json:"min_stock"`
	AvgCost  float64 `json:"avg_cost"`
}
