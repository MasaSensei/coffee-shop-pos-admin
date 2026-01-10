package recipes

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

func (h *Handler) GetByVariant(c *fiber.Ctx) error {
	// Ambil variant_id dari parameter URL: /recipes/:variant_id
	variantID, err := strconv.Atoi(c.Params("variant_id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "ID Varian tidak valid"})
	}

	data, err := h.svc.GetByVariant(variantID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(data)
}

func (h *Handler) Store(c *fiber.Ctx) error {
	var r Recipe
	if err := c.BodyParser(&r); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Input tidak valid"})
	}

	if err := h.svc.Create(r); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{"message": "Resep berhasil disimpan"})
}
