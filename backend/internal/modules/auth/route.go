package auth

import (
	"database/sql"

	"github.com/MasaSensei/pos-admin/internal/modules/user"
	"github.com/gofiber/fiber/v2"
)

func RegisterRoute(router fiber.Router, db *sql.DB) {
	// Kita butuh user repo karena Auth ngecek data ke tabel users
	userRepo := user.NewRepository(db)
	svc := NewService(userRepo)
	handler := NewHandler(svc)

	auth := router.Group("/auth")
	auth.Post("/login", handler.Login)
}
