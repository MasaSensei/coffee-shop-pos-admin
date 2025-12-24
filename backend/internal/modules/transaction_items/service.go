package transactionitems

func (s *Service) AddItem(txID, menuID, qty int) error {
	menu, err := s.menuRepo.GetByID(menuID)
	if err != nil {
		return err
	}

	subtotal := float64(qty) * menu.Price

	err = s.repo.Create(&TransactionItem{
		TransactionID: txID,
		MenuID:        menuID,
		Qty:           qty,
		Price:         menu.Price,
		Subtotal:      subtotal,
	})
	if err != nil {
		return err
	}

	total, err := s.repo.SumTotal(txID)
	return s.txRepo.UpdateTotal(txID, total)
}
