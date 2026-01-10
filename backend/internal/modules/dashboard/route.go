package dashboard

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoute(router fiber.Router, db *sql.DB) {
	dashRepo := NewRepository(db)
	dashHandler := NewHandler(dashRepo)

	api := router.Group("/dashboard")
	api.Get("/stats", dashHandler.GetDashboardStats)

}
