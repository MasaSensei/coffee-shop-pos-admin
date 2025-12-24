package payments

import "database/sql"

type Repository interface {
	Create(p *Payment) error
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{
		db: db,
	}
}

func (r *repository) Create(p *Payment) error {
	_, err := r.db.Exec(`
		INSERT INTO transaction_payments (transaction_id, payment_method_id, amount)
		VALUES (?, ?, ?)
	`, p.TransactionID, p.PaymentMethodID, p.Amount)
	return err
}
