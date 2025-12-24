package ingredients

type Ingredient struct {
	ID        int     `json:"id"`
	Name      string  `json:"name"`
	Unit      string  `json:"unit"`
	CostPrice float64 `json:"cost_price"`
}
