package user

import "database/sql"

type Repository interface {
	Insert(u User) (int64, error)
	GetByUsername(username string) (*User, error)
}

type repository struct {
	DB *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{DB: db}
}

func (r *repository) Insert(u User) (int64, error) {
	query := `INSERT INTO users (outlet_id, name, username, password_hash, role) VALUES (?, ?, ?, ?, ?)`
	res, err := r.DB.Exec(query, u.OutletID, u.Name, u.Username, u.PasswordHash, u.Role)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

func (r *repository) GetByUsername(username string) (*User, error) {
	var u User
	query := `SELECT id, outlet_id, name, username, password_hash, role FROM users WHERE username = ?`
	err := r.DB.QueryRow(query, username).Scan(&u.ID, &u.OutletID, &u.Name, &u.Username, &u.PasswordHash, &u.Role)
	if err != nil {
		return nil, err
	}
	return &u, nil
}
