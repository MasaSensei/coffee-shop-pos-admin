package utils

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateToken(userID int, role string, outletID int) (string, error) {
	claims := jwt.MapClaims{
		"user_id":   userID,
		"role":      role,
		"outlet_id": outletID,
		"exp":       time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte("RAHASIA_KOPIMU_2024")) // Gunakan secret yang aman
}
