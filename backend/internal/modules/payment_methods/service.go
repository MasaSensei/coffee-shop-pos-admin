package payment_methods

type Service interface {
	GetAll() ([]PaymentMethod, error)
	Create(pm PaymentMethod) error
}

type service struct{ repo Repository }

func NewService(repo Repository) Service { return &service{repo} }

func (s *service) GetAll() ([]PaymentMethod, error) {
	return s.repo.FetchAll()
}

func (s *service) Create(pm PaymentMethod) error {
	return s.repo.Create(pm)
}
