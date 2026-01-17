package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	XenditSecretKey string
	DBURL           string
}

func LoadConfig() *Config {
	// Mencari file .env di root project
	_ = godotenv.Load()

	return &Config{
		XenditSecretKey: os.Getenv("XENDIT_SECRET_KEY"),
	}
}
