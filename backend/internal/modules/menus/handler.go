package menus

import "github.com/gofiber/fiber/v2"

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
