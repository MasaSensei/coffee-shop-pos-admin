package categories

type Category struct {
	ID         int    `json:"id"`
	Name       string `json:"name"`
	TotalMenus int    `json:"total_menus"`
}
