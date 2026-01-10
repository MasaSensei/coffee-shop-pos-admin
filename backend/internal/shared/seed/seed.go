package seed

import (
	"database/sql"
	"log"

	"github.com/MasaSensei/pos-admin/internal/shared/utils"
)

func SeedAdmin(db *sql.DB) {
	// 1. Pastikan tabel sudah ada (Migrasi selesai)
	// 2. Insert Outlet Pusat jika belum ada
	var outletID int64
	err := db.QueryRow("SELECT id FROM outlets WHERE id = 1").Scan(&outletID)
	if err == sql.ErrNoRows {
		res, err := db.Exec(`INSERT INTO outlets (id, name, address, is_active) 
                             VALUES (1, 'Kantor Pusat', 'Alamat Pusat', 1)`)
		if err != nil {
			log.Println("Gagal seed outlet:", err)
			return
		}
		outletID, _ = res.LastInsertId()
		log.Println("✅ Seed Outlet Pusat berhasil")
	}

	// 3. Insert Super Admin jika belum ada
	var userExists int
	db.QueryRow("SELECT COUNT(*) FROM users WHERE username = 'admin'").Scan(&userExists)
	if userExists == 0 {
		hashed, _ := utils.HashPassword("admin123")
		query := `INSERT INTO users (outlet_id, name, username, password_hash, role, is_active) 
                   VALUES (?, 'Super Admin', 'admin', ?, 'Admin', 1)`

		_, err := db.Exec(query, 1, hashed)
		if err != nil {
			log.Println("❌ Gagal seed admin:", err)
		} else {
			log.Println("✅ Seed Super Admin berhasil (user: admin, pass: admin123)")
		}
	}
}
