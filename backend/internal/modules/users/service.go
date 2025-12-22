package users

import (
	"errors"

	"golang.org/x/crypto/bcrypt"
)

type Service interface {
	Login(username, password string) (*User, error)
	CreateUser(name, username, password, role string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{
		repo: repo,
	}
}

func (s *service) Login(username, password string) (*User, error) {
	user, err := s.repo.FindByUsername(username)
	if err != nil {
		return nil, err
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, errors.New("invalid password")
	}

	return user, nil
}

func (s *service) CreateUser(name, username, password, role string) error {
	hash, err := bcrypt.GenerateFromPassword(
		[]byte(password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return err
	}

	return s.repo.Create(&User{
		Name:     name,
		Username: username,
		Password: string(hash),
		Role:     role,
	})
}
