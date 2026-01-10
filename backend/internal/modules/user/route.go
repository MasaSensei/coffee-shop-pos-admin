package user

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoute(router fiber.Router, db *sql.DB) {
	repo := NewRepository(db)
	svc := NewService(repo)
	handler := NewHandler(svc)

	users := router.Group("/users")
	users.Post("/register", handler.CreateStaff)
	users.Get("/", handler.GetAllStaff)
	users.Put("/:id", handler.UpdateStaff)
	users.Delete("/:id", handler.DeleteStaff)
}
