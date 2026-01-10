package user

import (
	"errors"

	"github.com/MasaSensei/pos-admin/internal/shared/utils"
)

type Service interface {
	RegisterUser(req RegisterRequest) (int64, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) RegisterUser(req RegisterRequest) (int64, error) {
	// 1. Validasi: Cek apakah user sudah ada
	existing, _ := s.repo.GetByUsername(req.Username)
	if existing != nil {
		return 0, errors.New("username sudah digunakan")
	}

	// 2. Hash Password
	hashed, err := utils.HashPassword(req.Password)
	if err != nil {
		return 0, err
	}

	// 3. Mapping ke Model
	newUser := User{
		OutletID:     req.OutletID,
		Name:         req.Name,
		Username:     req.Username,
		PasswordHash: hashed,
		Role:         req.Role,
	}

	return s.repo.Insert(newUser)
}
