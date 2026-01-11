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
	offset := (page - 1) * limit
	var data []Ingredient
	var total int
	var err error

	if outletID > 0 {
		// Jika ada ID, filter per outlet
		data, total, err = s.repo.FetchByOutlet(outletID, offset, limit)
	} else {
		// Jika ID 0, ambil semua (PENTING untuk Dropdown Purchasing)
		data, total, err = s.repo.FetchAll(offset, limit)
	}

	if err != nil {
		return utils.PaginatedResponse{}, err
	}

	return utils.PaginatedResponse{
		Data: data,
		Meta: utils.CreateMeta(total, page, limit),
	}, nil
}

func (s *service) AddIngredient(i Ingredient) error {
	// Di sini nanti tempat logika bisnis tambahan (validasi, dll)
	return s.repo.Create(i)
}
