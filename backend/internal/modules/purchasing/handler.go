package purchasing

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	svc Service
}

func NewHandler(svc Service) *Handler { return &Handler{svc} }

func (h *Handler) Store(c *fiber.Ctx) error {
	var input PurchaseOrder
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Ambil user_id (sekarang sudah pasti int)
	userID, ok := c.Locals("user_id").(int)
	if !ok {
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized: User ID not found"})
	}

	// Ambil outlet_id dari token jika di payload frontend kosong
	if input.OutletID == 0 {
		if oid, ok := c.Locals("outlet_id").(int); ok {
			input.OutletID = oid
		}
	}

	input.UserID = userID

	id, err := h.svc.CreateOrder(c.Context(), input)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{"id": id, "message": "Purchase Order Created"})
}

func (h *Handler) Index(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))

	res, err := h.svc.GetOrders(c.Context(), page, limit)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(res)
}
