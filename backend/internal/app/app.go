package app

import (
	"database/sql"

	"github.com/MasaSensei/pos-admin/internal/modules/auth"
	"github.com/MasaSensei/pos-admin/internal/modules/categories"
	"github.com/MasaSensei/pos-admin/internal/modules/dashboard"
	"github.com/MasaSensei/pos-admin/internal/modules/ingredients"
	"github.com/MasaSensei/pos-admin/internal/modules/menu_variants"
	"github.com/MasaSensei/pos-admin/internal/modules/menus"
	"github.com/MasaSensei/pos-admin/internal/modules/outlet"
	"github.com/MasaSensei/pos-admin/internal/modules/payment_methods"
	"github.com/MasaSensei/pos-admin/internal/modules/purchasing"
	"github.com/MasaSensei/pos-admin/internal/modules/recipes"
	"github.com/MasaSensei/pos-admin/internal/modules/sales"
	"github.com/MasaSensei/pos-admin/internal/modules/shifts"
	"github.com/MasaSensei/pos-admin/internal/modules/suppliers"
	"github.com/MasaSensei/pos-admin/internal/modules/user"
	"github.com/MasaSensei/pos-admin/internal/shared/config"
	"github.com/MasaSensei/pos-admin/internal/shared/middleware"
	"github.com/gofiber/fiber/v2"
)

func Register(app *fiber.App, db *sql.DB) {
	cfg := config.LoadConfig()
	// Root API Group
	api := app.Group("/api/v1")

	auth.RegisterRoute(api, db)

	api.Use(middleware.JWTMiddleware)

	user.RegisterRoute(api, db)
	outlet.RegisterRoute(api, db)
	ingredients.RegisterRoute(api, db)
	categories.RegisterRoute(api, db)
	menus.RegisterRoute(api, db)
	recipes.RegisterRoute(api, db)
	menu_variants.RegisterRoute(api, db)
	suppliers.RegisterRoute(api, db)
	purchasing.RegisterRoute(api, db)
	payment_methods.RegisterRoute(api, db)
	shifts.RegisterRoute(api, db)
	sales.RegisterRoute(api, db, cfg.XenditSecretKey)
	dashboard.RegisterRoute(api, db)
}
