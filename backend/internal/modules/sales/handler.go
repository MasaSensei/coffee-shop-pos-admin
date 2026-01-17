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

	if len(input.Items) == 0 {
		return c.Status(400).JSON(fiber.Map{"error": "Keranjang belanja kosong"})
	}

	// Memanggil fungsi ProcessTransaction yang sudah diperbaiki
	result, err := h.svc.ProcessTransaction(c.Context(), input)
	if err != nil {
		// Jika error karena "pembayaran kurang", status code 400 lebih tepat
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{
		"message": "Transaksi Berhasil",
		"data":    result, // Mengembalikan object lengkap termasuk QRString
	})
}
