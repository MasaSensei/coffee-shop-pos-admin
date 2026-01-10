package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func JWTMiddleware(c *fiber.Ctx) error {
	// 1. Ambil token dari header Authorization: Bearer <token>
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Unauthenticated: Missing token",
		})
	}

	// 2. Potong string "Bearer "
	tokenString := strings.Replace(authHeader, "Bearer ", "", 1)

	// 3. Parse dan Validasi Token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Pastikan secret key sama dengan yang ada di utils/jwt.go
		return []byte("RAHASIA_KOPIMU_2024"), nil
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Unauthenticated: Invalid or expired token",
		})
	}

	// 4. Simpan data user dari token ke context (agar bisa dipakai di handler/service)
	claims := token.Claims.(jwt.MapClaims)
	c.Locals("user_id", claims["user_id"])
	c.Locals("role", claims["role"])
	c.Locals("outlet_id", claims["outlet_id"])

	return c.Next()
}
