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

func (h *Handler) Create(c *fiber.Ctx) error {
	type request struct {
		Name string `json:"name"`
	}

	var req request
	if err := c.BodyParser(&req); err != nil {
		return err
	}

	if err := h.repo.Create(req.Name); err != nil {
		return err
	}

	return c.SendStatus(fiber.StatusCreated)
}
