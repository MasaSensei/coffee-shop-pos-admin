package payment_methods

import "database/sql"

type Repository interface {
	FetchAll() ([]PaymentMethod, error)
	Create(pm PaymentMethod) error
}

type repository struct{ db *sql.DB }

func NewRepository(db *sql.DB) Repository { return &repository{db} }

func (r *repository) FetchAll() ([]PaymentMethod, error) {
	rows, err := r.db.Query("SELECT id, name, type FROM payment_methods")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var res []PaymentMethod
	for rows.Next() {
		var pm PaymentMethod
		rows.Scan(&pm.ID, &pm.Name, &pm.Type)
		res = append(res, pm)
	}
	return res, nil
}

func (r *repository) Create(pm PaymentMethod) error {
	_, err := r.db.Exec("INSERT INTO payment_methods (name, type) VALUES (?, ?)", pm.Name, pm.Type)
	return err
}
