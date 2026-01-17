package auth

import (
	"errors"

	"github.com/MasaSensei/pos-admin/internal/modules/user"
	"github.com/MasaSensei/pos-admin/internal/shared/utils"
)

type Service interface {
	Login(username, password string) (*LoginResponse, error)
}

type service struct {
	userRepo user.Repository
}

type LoginResponse struct {
	Token    string
	UserID   int
	Username string
	OutletID int
	Role     string
}

func NewService(repo user.Repository) Service {
	return &service{userRepo: repo}
}

func (s *service) Login(username, password string) (*LoginResponse, error) {
	u, err := s.userRepo.GetByUsername(username)
	if err != nil {
		return nil, errors.New("username atau password salah")
	}

	if !utils.CheckPasswordHash(password, u.PasswordHash) {
		return nil, errors.New("username atau password salah")
	}

	// Pass u.OutletID ke GenerateToken (sudah ada di kode kamu)
	token, err := utils.GenerateToken(u.ID, u.Role, u.OutletID)
	if err != nil {
		return nil, err
	}

	return &LoginResponse{
		Token:    token,
		UserID:   u.ID,
		Username: u.Username,
		OutletID: u.OutletID,
		Role:     u.Role,
	}, nil
}
