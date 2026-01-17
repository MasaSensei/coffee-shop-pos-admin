package sales

import "time"

type Transaction struct {
	ID               int               `json:"id"`
	InvoiceNo        string            `json:"invoice_no"`
	QueueNumber      int               `json:"queue_number"`
	ShiftID          int               `json:"shift_id"`
	UserID           int               `json:"user_id"`
	CustomerID       *int              `json:"customer_id"`
	PaymentMethodID  int               `json:"payment_method_id"`
	OrderSource      string            `json:"order_source"`
	OrderType        string            `json:"order_type"`
	Subtotal         float64           `json:"subtotal"`
	TaxAmount        float64           `json:"tax_amount"`
	DiscountAmount   float64           `json:"discount_amount"`
	GrandTotal       float64           `json:"grand_total"`
	AmountPaid       float64           `json:"amount_paid"`
	ChangeAmount     float64           `json:"change_amount"`
	Status           string            `json:"status"`
	CreatedAt        time.Time         `json:"created_at"`
	Items            []TransactionItem `json:"items"`
	PaymentReference string            `json:"payment_reference"` // External ID Xendit
	QRString         string            `json:"qr_string"`         // Isi data QRIS
}

type TransactionItem struct {
	ID            int     `json:"id"`
	TransactionID int     `json:"transaction_id"`
	MenuVariantID int     `json:"menu_variant_id"`
	Qty           int     `json:"qty"`
	PriceAtSale   float64 `json:"price_at_sale"`
	CostAtSale    float64 `json:"cost_at_sale"` // Ini akan diisi otomatis dari avg_cost_price bahan
}
