package sales

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

// Tambahkan parameter xenditKey
func RegisterRoute(router fiber.Router, db *sql.DB, xenditKey string) {
	// Inisialisasi Layer
	repo := NewRepository(db)

	// Suntikkan xenditKey ke Service
	svc := NewService(repo, xenditKey)
	handler := NewHandler(svc)

	s := router.Group("/sales")
	s.Post("/checkout", handler.Store)
}
