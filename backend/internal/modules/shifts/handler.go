package shifts

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type Handler struct{ svc Service }

func NewHandler(svc Service) *Handler { return &Handler{svc} }

func (h *Handler) Open(c *fiber.Ctx) error {
	var input Shift
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	id, err := h.svc.Open(c.Context(), input)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{
		"message":  "Shift opened successfully",
		"shift_id": id,
	})
}

func (h *Handler) CheckActive(c *fiber.Ctx) error {
	userID, _ := strconv.Atoi(c.Query("user_id"))
	res, err := h.svc.GetActive(c.Context(), userID)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "No active shift found"})
	}
	return c.JSON(res)
}

func (h *Handler) Close(c *fiber.Ctx) error {
	var input CloseShiftInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	summary, err := h.svc.Close(c.Context(), input)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"message": "Shift closed successfully",
		"summary": summary,
	})
}
