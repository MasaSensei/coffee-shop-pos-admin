package app

import (
	"database/sql"

	"github.com/MasaSensei/pos-admin/internal/modules/shifts"
	"github.com/MasaSensei/pos-admin/internal/modules/users"
	"github.com/gofiber/fiber/v2"
)

func Register(app *fiber.App, db *sql.DB) {
	api := app.Group("/api/v1")
	users.RegisterRoutes(api.Group("/users"), db)
	shifts.RegisterRoutes(api.Group("/shifts"), db)
}
