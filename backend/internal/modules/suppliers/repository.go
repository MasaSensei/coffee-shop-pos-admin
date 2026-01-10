package suppliers

import "database/sql"

type Repository interface {
	Create(s Supplier) error
	FetchAll(offset, limit int) ([]Supplier, int, error)
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository { return &repository{db} }

func (r *repository) Create(s Supplier) error {
	_, err := r.db.Exec(
		"INSERT INTO suppliers (name, contact_person, phone, address) VALUES (?, ?, ?, ?)",
		s.Name, s.ContactPerson, s.Phone, s.Address,
	)
	return err
}

func (r *repository) FetchAll(offset, limit int) ([]Supplier, int, error) {
	var total int
	r.db.QueryRow("SELECT COUNT(*) FROM suppliers").Scan(&total)

	rows, err := r.db.Query("SELECT id, name, contact_person, phone, address FROM suppliers LIMIT ? OFFSET ?", limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var res []Supplier
	for rows.Next() {
		var s Supplier
		rows.Scan(&s.ID, &s.Name, &s.ContactPerson, &s.Phone, &s.Address)
		res = append(res, s)
	}
	return res, total, nil
}
