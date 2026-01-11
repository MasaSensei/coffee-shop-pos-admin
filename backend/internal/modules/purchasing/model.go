package purchasing

import "time"

type PurchaseOrder struct {
	ID           int                 `json:"id"`
	SupplierID   int                 `json:"supplier_id"`
	SupplierName string              `json:"supplier_name"` // Tambah ini
	UserID       int                 `json:"user_id"`
	OutletID     int                 `json:"outlet_id"`
	PONumber     string              `json:"po_number"`
	Status       string              `json:"status"`
	TotalCost    float64             `json:"total_cost"`
	ReceivedAt   *time.Time          `json:"received_at"`
	CreatedAt    time.Time           `json:"created_at"`
	Items        []PurchaseOrderItem `json:"items"`
}

type PurchaseOrderItem struct {
	ID             int     `json:"id"`
	IngredientID   int     `json:"ingredient_id"`
	IngredientName string  `json:"ingredient_name"` // Tambah ini supaya UI enak bacanya
	QtyReceived    float64 `json:"qty_received"`
	CostPerUnit    float64 `json:"cost_per_unit"`
	Subtotal       float64 `json:"subtotal"`
}
