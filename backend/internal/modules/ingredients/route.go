package ingredients

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoute(router fiber.Router, db *sql.DB) {
	repo := NewRepository(db)
	svc := NewService(repo)
	handler := NewHandler(svc)

	ingredients := router.Group("/ingredients")
	ingredients.Post("/", handler.Store)
	ingredients.Get("/", handler.GetByOutlet)
	ingredients.Get("/history", handler.GetAllHistory)
	ingredients.Get("/:id/history", handler.GetHistory)
	ingredients.Post("/adjust", handler.Adjust)
}
