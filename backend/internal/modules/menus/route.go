package menus

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoute(router fiber.Router, db *sql.DB) {
	repo := NewRepository(db)
	svc := NewService(repo)
	handler := NewHandler(svc)

	menus := router.Group("/menus")
	menus.Get("/", handler.Index)
	menus.Post("/", handler.Store)
}
