package users

import (
	"database/sql"
	"errors"

	"github.com/MasaSensei/pos-admin/internal/shared/database"
)

var ErrUserNotFound = errors.New("user not found")

type Repository interface {
	FindByUsername(username string) (*User, error)
	FindByID(id int) (*User, error)
	Create(user *User) error
}

type repository struct {
	db *sql.DB
}

func NewRepository() Repository {
	return &repository{
		db: database.Get(),
	}
}

func (r *repository) FindByUsername(username string) (*User, error) {
	row := r.db.QueryRow(`
		SELECT id, name, username, password, role, created_at
		FROM users
		WHERE username = ?
		LIMIT 1
	`, username)

	return scanUser(row)
}

func (r *repository) FindByID(id int) (*User, error) {
	row := r.db.QueryRow(`
		SELECT id, name, username, password, role, created_at
		FROM users
		WHERE id = ?
		LIMIT 1
	`, id)

	return scanUser(row)
}

func (r *repository) Create(user *User) error {
	result, err := r.db.Exec(`
		INSERT INTO users (name, username, password, role, created_at)
		VALUES (?, ?, ?, ?, ?)
	`, user.Name, user.Username, user.Password, user.Role, user.CreatedAt)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}
	user.ID = int(id)

	return nil
}

func scanUser(row *sql.Row) (*User, error) {
	var u User
	err := row.Scan(
		&u.ID,
		&u.Name,
		&u.Username,
		&u.Password,
		&u.Role,
		&u.CreatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, ErrUserNotFound
	}
	if err != nil {
		return nil, err
	}

	return &u, nil
}
