package users

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(r fiber.Router, db *sql.DB) {
	repo := NewRepository()
	service := NewService(repo)
	handler := NewHandler(service)

	r.Post("/login", handler.Login)
}
