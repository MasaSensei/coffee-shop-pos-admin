package sales

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoute(router fiber.Router, db *sql.DB) {
	// Inisialisasi Layer
	repo := NewRepository(db)
	svc := NewService(repo)
	handler := NewHandler(svc)

	// Grouping Route Sales
	s := router.Group("/sales")

	// Endpoint utama untuk transaksi (Checkout)
	s.Post("/checkout", handler.Store)

}
