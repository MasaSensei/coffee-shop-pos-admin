package outlet

import (
	"database/sql"
	"errors"
)

type Service interface {
	Create(req CreateRequest) (int64, error)
	FindAll(page, limit int) ([]Outlet, int, error)
	GetDetail(id, shiftPage, shiftLimit int) (*OutletDetailResponse, int, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Create(req CreateRequest) (int64, error) {
	if req.Name == "" {
		return 0, errors.New("nama outlet tidak boleh kosong")
	}

	newOutlet := Outlet{
		Name:    req.Name,
		Address: req.Address,
		Phone:   sql.NullString{String: req.Phone, Valid: req.Phone != ""},
	}
	return s.repo.Insert(newOutlet)
}

func (s *service) FindAll(page, limit int) ([]Outlet, int, error) {
	if limit <= 0 {
		limit = 10
	}
	if page <= 0 {
		page = 1
	}

	// Panggil r.repo.FindAll (sesuai nama baru di interface)
	return s.repo.FindAll(page, limit)
}

func (s *service) GetDetail(id, shiftPage, shiftLimit int) (*OutletDetailResponse, int, error) {
	if shiftLimit <= 0 {
		shiftLimit = 10
	}
	if shiftPage <= 0 {
		shiftPage = 1
	}

	// Memanggil repository GetDetail (asumsi repo sudah diupdate ke GetDetail)
	return s.repo.GetDetail(id, shiftPage, shiftLimit)
}
