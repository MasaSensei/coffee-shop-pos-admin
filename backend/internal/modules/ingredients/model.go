package ingredients

type Ingredient struct {
	ID           int     `json:"id"`
	OutletID     int     `json:"outlet_id"`
	Name         string  `json:"name"`
	Unit         string  `json:"unit"`
	StockQty     float64 `json:"stock_qty"`
	AvgCostPrice float64 `json:"avg_cost_price"`
}
