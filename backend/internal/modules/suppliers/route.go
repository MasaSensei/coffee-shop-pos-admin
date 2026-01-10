package suppliers

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoute(router fiber.Router, db *sql.DB) {
	repo := NewRepository(db)
	svc := NewService(repo)
	handler := NewHandler(svc)

	s := router.Group("/suppliers")
	s.Post("/", handler.Store)
	s.Get("/", handler.Index)
}
