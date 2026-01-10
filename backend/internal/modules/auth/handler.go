package auth

import "github.com/gofiber/fiber/v2"

type Handler struct {
	svc Service
}

func NewHandler(s Service) *Handler {
	return &Handler{svc: s}
}

func (h *Handler) Login(c *fiber.Ctx) error {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"message": "Format request salah"})
	}

	token, err := h.svc.Login(req.Username, req.Password)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"message": err.Error()})
	}

	return c.JSON(fiber.Map{
		"token": token,
		"type":  "Bearer",
	})
}
