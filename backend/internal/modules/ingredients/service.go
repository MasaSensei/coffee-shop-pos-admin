package ingredients

import "github.com/MasaSensei/pos-admin/internal/shared/utils"

type Service interface {
	GetOutletStock(outletID int, page int, limit int) (utils.PaginatedResponse, error)
	AddIngredient(i Ingredient) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo}
}

func (s *service) GetOutletStock(outletID int, page int, limit int) (utils.PaginatedResponse, error) {
	// Hitung offset
	offset := (page - 1) * limit

	data, total, err := s.repo.FetchByOutlet(outletID, offset, limit)
	if err != nil {
		return utils.PaginatedResponse{}, err
	}

	// Gunakan helper CreateMeta kamu
	meta := utils.CreateMeta(total, page, limit)

	return utils.PaginatedResponse{
		Data: data,
		Meta: meta,
	}, nil
}

func (s *service) AddIngredient(i Ingredient) error {
	// Di sini nanti tempat logika bisnis tambahan (validasi, dll)
	return s.repo.Create(i)
}
