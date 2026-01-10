package auth

import (
	"errors"

	"github.com/MasaSensei/pos-admin/internal/modules/user"
	"github.com/MasaSensei/pos-admin/internal/shared/utils"
)

type Service interface {
	Login(username, password string) (string, error)
}

type service struct {
	userRepo user.Repository
}

func NewService(repo user.Repository) Service {
	return &service{userRepo: repo}
}

func (s *service) Login(username, password string) (string, error) {
	// 1. Cari user berdasarkan username
	u, err := s.userRepo.GetByUsername(username)
	if err != nil {
		return "", errors.New("username atau password salah")
	}

	// 2. Cek apakah password cocok
	if !utils.CheckPasswordHash(password, u.PasswordHash) {
		return "", errors.New("username atau password salah")
	}

	// 3. Generate Token JWT
	token, err := utils.GenerateToken(u.ID, u.Role, u.OutletID)
	if err != nil {
		return "", err
	}

	return token, nil
}
