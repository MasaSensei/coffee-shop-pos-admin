package shifts

import "database/sql"

type Repository interface {
	Open(userID int, cash float64) error
	Close(shiftID int, cash float64) error
	GetOpenShiftByUserID(userID int) (*Shift, error)
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{
		db: db,
	}
}

func (r *repository) GetOpenShiftByUserID(userID int) (*Shift, error) {
	row := r.db.QueryRow(`
		SELECT id, user_id, opened_at, opening_cash
		FROM shifts
		WHERE user_id = ?
			AND closed_at IS NULL
		LIMIT 1
	`, userID)

	s := &Shift{}
	err := row.Scan(&s.ID, &s.UserID, &s.OpenedAt, &s.OpeningCash)
	if err != nil {
		return nil, err
	}

	return s, nil
}

func (r *repository) Open(userID int, cash float64) error {
	_, err := r.db.Exec(`
		INSERT INTO shifts (user_id, opened_at, opening_cash)
		VALUES (?, CURRENT_TIMESTAMP, ?)
	`, userID, cash)
	return err
}

func (r *repository) Close(shiftID int, cash float64) error {
	_, err := r.db.Exec(`
		UPDATE shifts
		SET closed_at = CURRENT_TIMESTAMP, closing_cash = ?
		WHERE id = ?
	`, cash, shiftID)
	return err
}
