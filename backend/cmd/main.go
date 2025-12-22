package main

import (
	"log"

	"github.com/MasaSensei/pos-admin/internal/app"
	config "github.com/MasaSensei/pos-admin/internal/config/database"
	"github.com/MasaSensei/pos-admin/internal/shared/database"

	"github.com/gofiber/fiber/v2"
)

func main() {
	// 1. Fiber app (API only)
	appFiber := fiber.New()

	// 2. DB connect
	db, err := config.Connect()
	if err != nil {
		log.Fatal("DB connection failed:", err)
	}

	// 3. Init global DB
	database.Init(db)

	// 4. Run migrations
	if err := database.RunMigrations(db, "db/migrations"); err != nil {
		log.Fatal("Migration failed:", err)
	}

	// 5. Register routes
	app.Register(appFiber)

	// 6. Start server
	log.Fatal(appFiber.Listen(":3000"))
}
