package user

import (
	"database/sql"
)

type Repository interface {
	Insert(u User) (int64, error)
	GetAll() ([]User, error)
	Update(u User) error
	Delete(id int) error
	GetByUsername(username string) (*User, error)
}

type repository struct {
	DB *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{DB: db}
}

func (r *repository) Insert(u User) (int64, error) {
	// Gunakan 1 atau true (SQLite akan mengonversi 1 menjadi true untuk kolom BOOLEAN)
	query := `INSERT INTO users (outlet_id, name, username, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?, 1)`
	res, err := r.DB.Exec(query, u.OutletID, u.Name, u.Username, u.PasswordHash, u.Role)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

func (r *repository) GetAll() ([]User, error) {
	// Kita join dengan outlets agar di tabel staff muncul nama outletnya
	query := `
		SELECT u.id, u.outlet_id, u.name, u.username, u.role, u.is_active, u.created_at
		FROM users u ORDER BY u.id DESC`

	rows, err := r.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var u User
		err := rows.Scan(&u.ID, &u.OutletID, &u.Name, &u.Username, &u.Role, &u.IsActive, &u.CreatedAt)
		if err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	return users, nil
}

func (r *repository) Update(u User) error {
	query := `UPDATE users SET outlet_id = ?, name = ?, username = ?, role = ? WHERE id = ?`
	_, err := r.DB.Exec(query, u.OutletID, u.Name, u.Username, u.Role, u.ID)
	return err
}

func (r *repository) Delete(id int) error {
	_, err := r.DB.Exec(`DELETE FROM users WHERE id = ?`, id)
	return err
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
