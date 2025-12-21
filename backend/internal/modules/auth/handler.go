package auth

import "github.com/gofiber/fiber/v2"

type Handler struct{}

func NewHandler() *Handler {
	return &Handler{}
}

func (h *Handler) ShowLogin(c *fiber.Ctx) error {
	return c.Render("auth/login", fiber.Map{
		"Title": "Login Admin",
	}, "layouts/auth")
}

func (h *Handler) ShowRegister(c *fiber.Ctx) error {
	return c.Render("auth/register", fiber.Map{}, "layouts/auth")
}

func (h *Handler) Login(c *fiber.Ctx) error {
	return c.SendString("OK")
}
