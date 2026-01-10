package payment_methods

type PaymentMethod struct {
	ID   int    `json:"id"`
	Name string `json:"name"` // Cash, QRIS, Debit
	Type string `json:"type"` // Tunai, Digital
}
