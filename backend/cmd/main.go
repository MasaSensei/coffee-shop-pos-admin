package main

import (
	"log"

	"github.com/MasaSensei/pos-admin/internal/app"
	config "github.com/MasaSensei/pos-admin/internal/config/database"
	"github.com/MasaSensei/pos-admin/internal/shared/database"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
)

func main() {
	// 1. Template engine
	engine := html.New("./web/templates", ".html")

	// 2. Fiber app
	appFiber := fiber.New(fiber.Config{
		Views: engine,
	})

	// 3. DB connect
	db, err := config.Connect()
	if err != nil {
		log.Fatal("DB connection failed:", err)
	}

	// 4. Init global DB
	database.Init(db)

	// 5. Run migrations
	if err := database.RunMigrations(db, "db/migrations"); err != nil {
		log.Fatal("Migration failed:", err)
	}

	// 6. Register routes
	app.Register(appFiber)

	// 7. Start server
	log.Fatal(appFiber.Listen(":3000"))
}
