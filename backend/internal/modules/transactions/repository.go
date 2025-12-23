package transactions

import "database/sql"

type Repository interface {
	Create(tx *Transaction) (int, error)
	UpdateTotal(id int, total float64) error
}

type repo struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repo{db}
}

func (r *repo) Create(t *Transaction) (int, error) {
	res, err := r.db.Exec(`
		INSERT INTO transactions (shift_id, user_id, total, status)
		VALUES (?, ?, 0, 'PAID')
	`, t.ShiftID, t.UserID)

	if err != nil {
		return 0, err
	}

	id, _ := res.LastInsertId()
	return int(id), nil
}

func (r *repo) UpdateTotal(id int, total float64) error {
	_, err := r.db.Exec(`
		UPDATE transactions SET total = ? WHERE id = ?
	`, total, id)
	return err
}
