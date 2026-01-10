package recipes

type Service interface {
	GetByVariant(variantID int) ([]Recipe, error)
	Create(r Recipe) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service { return &service{repo} }

func (s *service) GetByVariant(variantID int) ([]Recipe, error) {
	return s.repo.FetchByVariant(variantID)
}

func (s *service) Create(r Recipe) error { return s.repo.Create(r) }
