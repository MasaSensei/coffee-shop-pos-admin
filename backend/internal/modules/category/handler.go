package category

import "github.com/gofiber/fiber/v2"

type Handler struct {
	repo Repository
}

func NewHandler(repo Repository) *Handler {
	return &Handler{
		repo: repo,
	}
}

func (h *Handler) List(c *fiber.Ctx) error {
	categories, err := h.repo.GetAll()
	if err != nil {
		return err
	}

	return c.JSON(categories)
}
