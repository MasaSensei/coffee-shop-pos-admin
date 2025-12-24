package payments

type Payment struct {
	TransactionID   int
	PaymentMethodID int
	Amount          float64
}
