package users

import (
	"database/sql"
	"errors"

	"github.com/MasaSensei/pos-admin/internal/shared/database"
)

var ErrUserNotFound = errors.New("user not found")

type User struct {
	ID        int
	Name      string
	Username  string
	Password  string
	Role      string
	CreatedAt string
}

type Repository interface {
	FindByUsername(username string) (*User, error)
	FindByID(id int) (*User, error)
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
