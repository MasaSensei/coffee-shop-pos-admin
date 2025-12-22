package seed

import (
	"database/sql"
	"log"

	"golang.org/x/crypto/bcrypt"
)

func SeedAdmin(db *sql.DB) {
	var count int
	db.QueryRow(`SELECT COUNT(*) FROM users`).Scan(&count)

	if count > 0 {
		return
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)

	_, err := db.Exec(`
		INSERT INTO users (name, username, password, role, created_at)
		VALUES (?, ?, ?, ?, datetime('now'))
	`, "Administrator", "admin", string(hash), "admin")

	if err != nil {
		log.Fatal("Failed seed admin:", err)
	}

	log.Println("✅ Admin seeded (admin / admin123)")
}
