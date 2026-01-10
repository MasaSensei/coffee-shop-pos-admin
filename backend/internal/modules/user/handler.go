package user

import "github.com/gofiber/fiber/v2"

type Handler struct {
	service Service
}

func NewHandler(s Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) Register(c *fiber.Ctx) error {
	var req RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"message": "bad request"})
	}

	id, err := h.service.RegisterUser(req)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"message": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{
		"message": "user created",
		"id":      id,
	})
}
