package user

import (
	"golang.org/x/crypto/bcrypt"
)

type Service interface {
	Register(req RegisterRequest) (int64, error)
	FindAll() ([]User, error)
	Edit(id int, req RegisterRequest) error
	Remove(id int) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Register(req RegisterRequest) (int64, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return 0, err
	}

	u := User{
		OutletID:     req.OutletID,
		Name:         req.Name,
		Username:     req.Username,
		PasswordHash: string(hashed),
		Role:         req.Role,
	}
	return s.repo.Insert(u)
}

func (s *service) FindAll() ([]User, error) {
	return s.repo.GetAll()
}

func (s *service) Edit(id int, req RegisterRequest) error {
	u := User{
		ID:       id,
		OutletID: req.OutletID,
		Name:     req.Name,
		Username: req.Username,
		Role:     req.Role,
	}
	return s.repo.Update(u)
}

func (s *service) Remove(id int) error {
	return s.repo.Delete(id)
}
