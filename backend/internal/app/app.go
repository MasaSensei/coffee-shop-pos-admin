package app

import (
	"database/sql"

	"github.com/MasaSensei/pos-admin/internal/modules/auth"
	"github.com/MasaSensei/pos-admin/internal/modules/outlet"
	"github.com/MasaSensei/pos-admin/internal/modules/user"
	"github.com/MasaSensei/pos-admin/internal/shared/middleware"
	"github.com/gofiber/fiber/v2"
)

func Register(app *fiber.App, db *sql.DB) {
	// Root API Group
	api := app.Group("/api/v1")

	auth.RegisterRoute(api, db)

	api.Use(middleware.JWTMiddleware)

	user.RegisterRoute(api, db)
	outlet.RegisterRoute(api, db)

}
