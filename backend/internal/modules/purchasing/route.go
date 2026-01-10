package purchasing

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoute(router fiber.Router, db *sql.DB) {
	repo := NewRepository(db)
	svc := NewService(repo)
	handler := NewHandler(svc)

	p := router.Group("/purchasing")
	p.Post("/orders", handler.Store)
	p.Get("/orders", handler.Index)
}
