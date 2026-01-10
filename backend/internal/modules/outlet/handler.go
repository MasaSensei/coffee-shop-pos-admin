package outlet

import (
	"github.com/MasaSensei/pos-admin/internal/shared/utils"
	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	svc Service
}

func NewHandler(s Service) *Handler {
	return &Handler{svc: s}
}

func (h *Handler) Store(c *fiber.Ctx) error {
	var req CreateRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request"})
	}

	id, err := h.svc.Create(req)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{"id": id, "message": "outlet created"})
}

func (h *Handler) Index(c *fiber.Ctx) error {
	// 1. Ambil params dari URL, default ke page 1 limit 10
	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 10)

	// 2. Minta Service untuk mengembalikan data dan total count
	outlets, total, err := h.svc.FindAll(page, limit)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	// 3. Gunakan Utils untuk bungkus response
	return c.JSON(utils.PaginatedResponse{
		Data: outlets,
		Meta: utils.CreateMeta(total, page, limit),
	})
}
