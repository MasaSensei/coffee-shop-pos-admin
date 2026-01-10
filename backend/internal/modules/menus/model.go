package menus

type Variant struct {
	ID    string  `json:"id"`
	Name  string  `json:"variant_name"` // Sesuai dengan register("variants.index.name") di FE
	Price float64 `json:"price"`        // Sesuai dengan register("variants.index.price") di FE
}

type Menu struct {
	ID           int       `json:"id"`
	CategoryID   int       `json:"category_id"`
	CategoryName string    `json:"category_name"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
	IsActive     int       `json:"is_active"`
	Variants     []Variant `json:"variants"`
}
