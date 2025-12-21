package app

import (
	"github.com/MasaSensei/pos-admin/internal/modules/auth"
	"github.com/gofiber/fiber/v2"
)

func Register(app *fiber.App) {
	authHandler := auth.NewHandler()
	auth.Routes(app, authHandler)
}
