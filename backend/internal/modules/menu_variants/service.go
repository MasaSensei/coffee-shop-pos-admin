package menu_variants

type Service interface {
	AddVariant(mv MenuVariant) (int, error)
	GetByMenu(menuID int) ([]MenuVariant, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo}
}

func (s *service) AddVariant(mv MenuVariant) (int, error) {
	// Di sini kamu bisa tambah logic, misal Generate SKU otomatis
	return s.repo.Create(mv)
}

func (s *service) GetByMenu(menuID int) ([]MenuVariant, error) {
	return s.repo.FetchByMenu(menuID)
}
