package database

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3" // Penting untuk driver sqlite
)

// Variabel DB harus diawali huruf KAPITAL agar "Exported" (bisa diakses package lain)
var DB *sql.DB

// Tambahkan fungsi Init untuk membuka koneksi
func InitDB(dataSourceName string) error {
	var err error
	DB, err = sql.Open("sqlite3", dataSourceName)
	if err != nil {
		return err
	}
	return DB.Ping()
}
