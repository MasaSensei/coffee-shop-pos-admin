package dashboard

import "github.com/gofiber/fiber/v2"

type Handler struct {
	repo Repository
}

func NewHandler(repo Repository) *Handler { return &Handler{repo} }

func (h *Handler) GetDashboardStats(c *fiber.Ctx) error {
	stats, err := h.repo.GetStats(c.Context())
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   stats,
	})
}
