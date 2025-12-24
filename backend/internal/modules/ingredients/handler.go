package ingredients

import "github.com/gofiber/fiber/v2"

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) List(c *fiber.Ctx) error {
	data, _ := h.service.repo.GetAll()

	type response struct {
		Ingredient
		Stock float64 `json:"stock"`
	}

	var res []response
	for _, i := range data {
		stock, _ := h.service.repo.GetStock(i.ID)
		res = append(res, response{i, stock})
	}

	return c.JSON(res)
}

func (h *Handler) Get(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return fiber.ErrBadRequest
	}
	data, err := h.service.repo.GetByID(id)
	if err != nil {
		return fiber.ErrInternalServerError
	}
	return c.JSON(data)
}

func (h *Handler) Create(c *fiber.Ctx) error {
	type request struct {
		Name      string  `json:"name"`
		Unit      string  `json:"unit"`
		CostPrice float64 `json:"cost_price"`
	}

	var req request
	if err := c.BodyParser(&req); err != nil {
		return fiber.ErrBadRequest
	}

	if err := h.service.repo.Create(&Ingredient{
		Name:      req.Name,
		Unit:      req.Unit,
		CostPrice: req.CostPrice,
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
		Name      string  `json:"name"`
		Unit      string  `json:"unit"`
		CostPrice float64 `json:"cost_price"`
	}

	var req request
	if err := c.BodyParser(&req); err != nil {
		return fiber.ErrBadRequest
	}

	if err := h.service.repo.Update(&Ingredient{
		ID:        id,
		Name:      req.Name,
		Unit:      req.Unit,
		CostPrice: req.CostPrice,
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
	if err := h.service.repo.Delete(id); err != nil {
		return fiber.ErrInternalServerError
	}
	return c.SendStatus(fiber.StatusOK)
}

func (h *Handler) GetStock(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return fiber.ErrBadRequest
	}
	stock, err := h.service.repo.GetStock(id)
	if err != nil {
		return fiber.ErrInternalServerError
	}
	return c.JSON(fiber.Map{"stock": stock})
}
