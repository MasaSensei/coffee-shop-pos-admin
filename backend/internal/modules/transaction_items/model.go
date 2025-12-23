package transactionitems

type TransactionItem struct {
	ID            int
	TransactionID int
	MenuID        int
	Qty           int
	Price         float64
	Subtotal      float64
}
