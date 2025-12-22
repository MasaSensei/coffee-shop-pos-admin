package shifts

import "errors"

type Service interface {
	OpenShift(userID int, cash float64) error
	CloseShift(shiftID int, cash float64) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{
		repo: repo,
	}
}
func (s *service) OpenShift(userID int, cash float64) error {
	if _, err := s.repo.GetOpenShiftByUserID(userID); err == nil {
		return errors.New("Shift already open")
	}
	return s.repo.Open(userID, cash)
}

func (s *service) CloseShift(shiftID int, cash float64) error {
	shift, err := s.repo.GetOpenShiftByUserID(shiftID)
	if err != nil || shift == nil {
		return errors.New("No open shift found")
	}
	return s.repo.Close(shiftID, cash)
}
