package transactions

type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) CreateTransaction(shiftID, userID int) (int, error) {
	t := &Transaction{
		ShiftID: shiftID,
		UserID:  userID,
	}
	return s.repo.Create(t)
}

func (s *Service) Finalize(transactionID int, total float64) error {
	return s.repo.UpdateTotal(transactionID, total)
}
