package menus

type Menu struct {
	ID          int    `json:"id"`
	CategoryID  int    `json:"category_id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	IsActive    int    `json:"is_active"`
}
