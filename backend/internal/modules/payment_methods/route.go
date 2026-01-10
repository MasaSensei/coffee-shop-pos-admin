package payment_methods

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoute(router fiber.Router, db *sql.DB) {
	repo := NewRepository(db)
	svc := NewService(repo)
	handler := NewHandler(svc)

	pm := router.Group("/payment-methods")
	pm.Get("/", handler.Index)
	pm.Post("/", handler.Store)
}
