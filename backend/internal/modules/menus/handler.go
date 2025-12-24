package menus

import (
	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	repo Repository
}

func NewHandler(repo Repository) *Handler {
	return &Handler{repo}
}

func (h *Handler) List(c *fiber.Ctx) error {
	data, err := h.repo.GetAll()
	if err != nil {
		return fiber.ErrInternalServerError
	}
	return c.JSON(data)
}

func (h *Handler) Create(c *fiber.Ctx) error {
	type request struct {
		CategoryID int     `json:"category_id"`
		Name       string  `json:"name"`
		Price      float64 `json:"price"`
		Status     string  `json:"status"`
		IsAddon    bool    `json:"is_addon"`
	}

	var req request
	if err := c.BodyParser(&req); err != nil {
		return fiber.ErrBadRequest
	}

	if err := h.repo.Create(&Menu{
		CategoryID: req.CategoryID,
		Name:       req.Name,
		Price:      req.Price,
		Status:     req.Status,
		IsAddon:    req.IsAddon,
	}); err != nil {
		return fiber.ErrInternalServerError
	}

	return c.SendStatus(fiber.StatusCreated)
}

func (h *Handler) Update(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return fiber.ErrBadRequest
	}
	type request struct {
		CategoryID int     `json:"category_id"`
		Name       string  `json:"name"`
		Price      float64 `json:"price"`
		Status     string  `json:"status"`
		IsAddon    bool    `json:"is_addon"`
	}

	var req request
	if err := c.BodyParser(&req); err != nil {
		return fiber.ErrBadRequest
	}

	if err := h.repo.Update(&Menu{
		ID:         id,
		CategoryID: req.CategoryID,
		Name:       req.Name,
		Price:      req.Price,
		Status:     req.Status,
		IsAddon:    req.IsAddon,
	}); err != nil {
		return fiber.ErrInternalServerError
	}

	return c.SendStatus(fiber.StatusOK)
}

func (h *Handler) Delete(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return fiber.ErrBadRequest
	}

	if err := h.repo.Delete(id); err != nil {
		return fiber.ErrInternalServerError
	}

	return c.SendStatus(fiber.StatusOK)
}
