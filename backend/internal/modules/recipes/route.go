package recipes

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoute(router fiber.Router, db *sql.DB) {
	repo := NewRepository(db)
	svc := NewService(repo)
	handler := NewHandler(svc)

	r := router.Group("/recipes")
	r.Get("/variant/:variant_id", handler.GetByVariant) // Pakai params sesuai handlermu
	r.Post("/", handler.Store)
}
