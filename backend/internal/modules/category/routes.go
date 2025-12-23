package category

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(r fiber.Router, db *sql.DB) {
	repo := NewRepository(db)
	handler := NewHandler(repo)

	r.Get("/", handler.List)
}
