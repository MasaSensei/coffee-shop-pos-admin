package main

import (
	"log"

	"github.com/MasaSensei/pos-admin/internal/app"
	config "github.com/MasaSensei/pos-admin/internal/config/database"
	"github.com/MasaSensei/pos-admin/internal/shared/database"
	"github.com/MasaSensei/pos-admin/internal/shared/seed"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors" // Import middleware CORS
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	appFiber := fiber.New()

	// --- TAMBAHKAN MIDDLEWARE CORS DI SINI ---
	appFiber.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173, http://127.0.0.1:5173", // URL Vite kamu
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))
	// ----------------------------------------

	db, err := config.Connect()
	if err != nil {
		log.Fatal("DB connection failed:", err)
	}
	defer db.Close()

	if err := database.RunMigrations(db, "database/migrations"); err != nil {
		log.Fatal("Migration failed:", err)
	}

	seed.SeedAdmin(db)

	app.Register(appFiber, db)

	log.Fatal(appFiber.Listen(":3000"))
}
