package ingredients

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	service Service
}

func NewHandler(s Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) GetByOutlet(c *fiber.Ctx) error {
	// Biarkan kosong jika tidak ada, strconv.Atoi akan menghasilkan 0
	outletID, _ := strconv.Atoi(c.Query("outlet_id"))
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))

	response, err := h.service.GetOutletStock(outletID, page, limit)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(response)
}

func (h *Handler) Store(c *fiber.Ctx) error {
	var input Ingredient
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid input"})
	}

	if err := h.service.AddIngredient(input); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(201).JSON(fiber.Map{"message": "success"})
}
