package menu_variants

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	svc Service
}

func NewHandler(svc Service) *Handler {
	return &Handler{svc}
}

func (h *Handler) Store(c *fiber.Ctx) error {
	var input MenuVariant
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid input"})
	}

	id, err := h.svc.AddVariant(input)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{
		"message": "variant created",
		"id":      id,
	})
}

func (h *Handler) GetByMenu(c *fiber.Ctx) error {
	menuID, err := strconv.Atoi(c.Params("menu_id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid menu_id"})
	}

	data, err := h.svc.GetByMenu(menuID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(data)
}
