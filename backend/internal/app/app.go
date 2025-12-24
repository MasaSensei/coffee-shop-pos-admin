package app

import (
	"database/sql"

	"github.com/MasaSensei/pos-admin/internal/modules/category"
	"github.com/MasaSensei/pos-admin/internal/modules/ingredients"
	"github.com/MasaSensei/pos-admin/internal/modules/menus"
	"github.com/MasaSensei/pos-admin/internal/modules/payments"
	"github.com/MasaSensei/pos-admin/internal/modules/shifts"
	"github.com/MasaSensei/pos-admin/internal/modules/transactions"
	"github.com/MasaSensei/pos-admin/internal/modules/users"
	"github.com/gofiber/fiber/v2"
)

func Register(app *fiber.App, db *sql.DB) {
	api := app.Group("/api/v1")
	users.RegisterRoutes(api.Group("/users"), db)
	shifts.RegisterRoutes(api.Group("/shifts"), db)
	transactions.RegisterRoutes(api.Group("/transactions"), db)
	category.RegisterRoutes(api.Group("/categories"), db)
	menus.RegisterRoutes(api.Group("/menus"), db)
	ingredients.RegisterRoutes(api.Group("/ingredients"), db)
	payments.RegisterRoutes(api.Group("/payments"), db)
}
