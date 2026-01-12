package menus

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

func (h *Handler) Index(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))

	res, err := h.svc.GetAll(page, limit)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(res)
}

func (h *Handler) Store(c *fiber.Ctx) error {
	var m Menu
	if err := c.BodyParser(&m); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Input tidak valid"})
	}

	id, err := h.svc.Create(m)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{
		"message": "Menu berhasil dibuat",
		"id":      id,
	})
}

func (h *Handler) Update(c *fiber.Ctx) error {
	// 1. Ambil ID dari parameter URL
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
	}

	// 2. Parse Body JSON
	var m Menu
	if err := c.BodyParser(&m); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Input tidak valid"})
	}

	// 3. Panggil Service
	err = h.svc.Update(id, m)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"message": "Menu berhasil diperbarui",
	})
}

func (h *Handler) Show(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "ID tidak valid"})
	}

	res, err := h.svc.GetByID(id)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Menu tidak ditemukan"})
	}
	return c.JSON(res)
}
