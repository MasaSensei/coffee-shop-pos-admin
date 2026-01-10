package shifts

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoute(router fiber.Router, db *sql.DB) {
	repo := NewRepository(db)
	svc := NewService(repo)
	handler := NewHandler(svc)

	s := router.Group("/shifts")
	s.Post("/open", handler.Open)
	s.Get("/active", handler.CheckActive)
	s.Post("/close", handler.Close)
}
