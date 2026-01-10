package sales

import (
	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	svc Service
}

func NewHandler(svc Service) *Handler { return &Handler{svc} }

func (h *Handler) Store(c *fiber.Ctx) error {
	var input Transaction
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Format data tidak valid"})
	}

	// Validasi minimal item
	if len(input.Items) == 0 {
		return c.Status(400).JSON(fiber.Map{"error": "Keranjang belanja kosong"})
	}

	id, err := h.svc.Checkout(c.Context(), input)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{
		"message": "Transaksi Berhasil",
		"id":      id,
	})
}
