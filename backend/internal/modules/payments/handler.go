package payments

import "github.com/gofiber/fiber/v2"

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) Create(c *fiber.Ctx) error {
	id, _ := c.ParamsInt("id")

	var req []struct {
		PaymentMethodID int     `json:"payment_method_id"`
		Amount          float64 `json:"amount"`
	}

	if err := c.BodyParser(&req); err != nil {
		return fiber.ErrBadRequest
	}

	var payments []Payment
	for _, p := range req {
		payments = append(payments, Payment{
			TransactionID:   id,
			PaymentMethodID: p.PaymentMethodID,
			Amount:          p.Amount,
		})
	}

	if err := h.service.Pay(id, payments); err != nil {
		return fiber.ErrInternalServerError
	}

	return c.SendStatus(fiber.StatusCreated)
}
