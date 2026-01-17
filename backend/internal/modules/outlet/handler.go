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

func (h *Handler) Show(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
	}

	shiftPage := c.QueryInt("shift_page", 1)
	shiftLimit := c.QueryInt("shift_limit", 10)

	detail, totalShifts, err := h.svc.GetDetail(id, shiftPage, shiftLimit)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	// Tetap gunakan utils.CreateMeta untuk konsistensi
	return c.JSON(fiber.Map{
		"data":        detail,
		"meta_shifts": utils.CreateMeta(totalShifts, shiftPage, shiftLimit),
	})
}

func (h *Handler) GetByID(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
	}

	outlet, err := h.svc.GetByID(id)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"data": outlet,
	})
}
