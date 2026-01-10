package menus

import "github.com/MasaSensei/pos-admin/internal/shared/utils"

type Service interface {
	GetAll(page, limit int) (utils.PaginatedResponse, error)
	Create(m Menu) (int, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service { return &service{repo} }

func (s *service) GetAll(page, limit int) (utils.PaginatedResponse, error) {
	offset := (page - 1) * limit
	data, total, err := s.repo.Fetch(offset, limit)
	if err != nil {
		return utils.PaginatedResponse{}, err
	}

	return utils.PaginatedResponse{
		Data: data,
		Meta: utils.CreateMeta(total, page, limit),
	}, nil
}

func (s *service) Create(m Menu) (int, error) { return s.repo.Create(m) }
