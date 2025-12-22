package shifts

import "github.com/gofiber/fiber/v2"

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) OpenShift(c *fiber.Ctx) error {
	var req struct {
		Cash float64 `json:"cash"`
		User int     `json:"user_id"`
	}

	c.BodyParser(&req)

	if err := h.service.OpenShift(req.User, req.Cash); err != nil {
		return fiber.ErrBadRequest
	}

	return c.SendStatus(200)
}

func (h *Handler) CloseShift(c *fiber.Ctx) error {
	var req struct {
		Cash float64 `json:"cash"`
		User int     `json:"user_id"`
	}

	c.BodyParser(&req)

	if err := h.service.CloseShift(req.User, req.Cash); err != nil {
		return fiber.ErrBadRequest
	}

	return c.SendStatus(200)
}
