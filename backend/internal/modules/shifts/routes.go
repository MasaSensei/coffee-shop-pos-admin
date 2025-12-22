package shifts

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(r fiber.Router, db *sql.DB) {
	repo := NewRepository(db)
	service := NewService(repo)
	handler := NewHandler(service)

	r.Post("/open", handler.OpenShift)
	r.Post("/close", handler.CloseShift)
}
