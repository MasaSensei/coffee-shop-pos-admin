package auth

import "github.com/gofiber/fiber/v2"

func Routes(app *fiber.App, h *Handler) {
	app.Get("/login", h.ShowLogin)
	app.Post("/login", h.Login)

	app.Get("/register", h.ShowRegister)
	// app.Post("/register", h.Register)
}
