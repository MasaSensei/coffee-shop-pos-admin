package auth

import (
	"errors"

	"github.com/MasaSensei/pos-admin/internal/modules/users"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrInvalidCredentials = errors.New("invalid credentials")
)

type LoginResult struct {
	ID       int
	Name     string
	Username string
	Role     string
}

type Service interface {
	Login(username, password string) (*LoginResult, error)
}

type service struct {
	usersRepo users.Repository
}

func NewService(usersRepo users.Repository) Service {
	return &service{
		usersRepo: usersRepo,
	}
}

func (s *service) Login(username, password string) (*LoginResult, error) {
	user, err := s.usersRepo.FindByUsername(username)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, ErrInvalidCredentials
	}

	return &LoginResult{
		ID:       user.ID,
		Name:     user.Name,
		Username: user.Username,
		Role:     user.Role,
	}, nil
}
