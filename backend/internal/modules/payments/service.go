package payments

type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) Pay(transactionID int, payments []Payment) error {
	tx, err := s.repo.(*repository).db.Begin()
	if err != nil {
		return err
	}

	var total float64
	for _, p := range payments {
		total += p.Amount
		if err := s.repo.Create(&p); err != nil {
			tx.Rollback()
			return err
		}
	}

	_, err = tx.Exec("UPDATE transactions SET paid_amount = paid_amount + ? WHERE id = ?", total, transactionID)
	if err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit()
}
