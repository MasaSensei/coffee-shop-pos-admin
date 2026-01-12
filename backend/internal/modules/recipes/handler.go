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

// Di Handler Store (recipes/handler.go)
func (h *Handler) StoreBatch(c *fiber.Ctx) error {
	var req []Recipe
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Input tidak valid"})
	}

	if len(req) == 0 {
		return c.Status(400).JSON(fiber.Map{"error": "Resep tidak boleh kosong"})
	}

	// Ambil variantID dari elemen pertama
	variantID := req[0].MenuVariantID

	// Panggil service Sync
	if err := h.svc.SyncRecipe(variantID, req); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{
		"message": "Formula berhasil disinkronkan",
	})
}
