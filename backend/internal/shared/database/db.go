package database

import "database/sql"

var DB *sql.DB

func Init(db *sql.DB) {
	DB = db
}

func Get() *sql.DB {
	if DB == nil {
		panic("Database not initialized. Call Init() first.")
	}
	return DB
}
