package menu_variants

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoute(router fiber.Router, db *sql.DB) {
	repo := NewRepository(db)
	svc := NewService(repo)
	handler := NewHandler(svc)

	v := router.Group("/variants")
	v.Post("/", handler.Store)
	v.Get("/menu/:menu_id", handler.GetByMenu)
}
