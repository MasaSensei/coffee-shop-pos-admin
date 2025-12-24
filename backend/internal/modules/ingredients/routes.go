package ingredients

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(r fiber.Router, db *sql.DB) {
	repo := NewRepository(db)
	service := NewService(repo)
	handler := NewHandler(service)

	r.Get("/", handler.List)
	r.Post("/", handler.Create)
	r.Put("/:id", handler.Update)
	r.Delete("/:id", handler.Delete)
}
