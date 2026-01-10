package database

import (
	"database/sql"
	"fmt"
	"os"
	"path/filepath"
	"sort"
)

func RunMigrations(db *sql.DB, migrationDir string) error {
	// 1. Aktifkan Foreign Keys
	db.Exec("PRAGMA foreign_keys = ON;")

	// 2. Buat tabel pelacak jika belum ada
	_, err := db.Exec(`CREATE TABLE IF NOT EXISTS migrations (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT UNIQUE,
		executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);`)
	if err != nil {
		return err
	}

	// 3. Baca daftar file
	files, err := os.ReadDir(migrationDir)
	if err != nil {
		return err
	}

	sort.Slice(files, func(i, j int) bool {
		return files[i].Name() < files[j].Name()
	})

	// 4. Eksekusi file yang belum terdaftar di tabel migrations
	for _, file := range files {
		if filepath.Ext(file.Name()) == ".sql" {
			// Cek apakah file ini sudah pernah dijalankan
			var exists int
			db.QueryRow("SELECT COUNT(*) FROM migrations WHERE name = ?", file.Name()).Scan(&exists)

			if exists > 0 {
				continue // Lewati file ini
			}

			fmt.Printf("Executing migration: %s\n", file.Name())
			content, err := os.ReadFile(filepath.Join(migrationDir, file.Name()))
			if err != nil {
				return err
			}

			// Jalankan SQL
			_, err = db.Exec(string(content))
			if err != nil {
				return fmt.Errorf("error in %s: %v", file.Name(), err)
			}

			// Catat bahwa file ini sudah sukses dijalankan
			_, err = db.Exec("INSERT INTO migrations (name) VALUES (?)", file.Name())
			if err != nil {
				return err
			}
		}
	}

	fmt.Println("✅ All new migrations executed successfully")
	return nil
}
