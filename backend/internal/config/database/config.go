package config

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

func Connect() (*sql.DB, error) {
	db, err := sql.Open("sqlite3", "database/pos.db")
	if err != nil {
		return nil, err
	}

	db.SetMaxOpenConns(1)
	db.Exec("PRAGMA foreign_keys = ON;")

	return db, nil
}
