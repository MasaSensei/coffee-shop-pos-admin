package menu_variants

type MenuVariant struct {
	ID          int     `json:"id"`
	MenuID      int     `json:"menu_id"`
	VariantName string  `json:"variant_name"`
	Price       float64 `json:"price"`
	SKU         string  `json:"sku"`
}
