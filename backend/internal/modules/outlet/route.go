package outlet

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoute(router fiber.Router, db *sql.DB) {
	repo := NewRepository(db)
	svc := NewService(repo)
	handler := NewHandler(svc)

	outlets := router.Group("/outlets")
	outlets.Post("/", handler.Store)
	outlets.Get("/", handler.Index)
}
