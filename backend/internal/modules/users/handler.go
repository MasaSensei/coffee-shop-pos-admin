package users

import (
	"github.com/MasaSensei/pos-admin/internal/shared/auth"
	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) Login(c *fiber.Ctx) error {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.BodyParser(&req); err != nil {
		return fiber.ErrBadRequest
	}

	user, err := h.service.Login(req.Username, req.Password)
	if err != nil {
		return fiber.ErrUnauthorized
	}

	token, _ := auth.GenerateToken(user.ID, user.Role)

	return c.JSON(fiber.Map{
		"token": token,
		"user": fiber.Map{
			"id":   user.ID,
			"name": user.Name,
			"role": user.Role,
		}})
}
