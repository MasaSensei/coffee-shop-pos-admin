package menus

type Menu struct {
	ID         int     `json:"id"`
	CategoryID int     `json:"category_id"`
	Name       string  `json:"name"`
	Price      float64 `json:"price"`
	Status     string  `json:"status"`
	IsAddon    bool    `json:"is_addon"`
}
