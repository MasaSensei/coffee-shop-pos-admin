package categories

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoute(router fiber.Router, db *sql.DB) {
	repo := NewRepository(db)
	svc := NewService(repo)
	handler := NewHandler(svc)

	categories := router.Group("/categories")
	categories.Get("/", handler.Index)
	categories.Post("/", handler.Store)
}
