package shifts

import "context"

type Service interface {
	Open(ctx context.Context, s Shift) (int, error)
	GetActive(ctx context.Context, userID int) (*Shift, error)
	Close(ctx context.Context, s CloseShiftInput) (*ShiftSummary, error)
}

type service struct{ repo Repository }

func NewService(repo Repository) Service { return &service{repo} }

func (s *service) Open(ctx context.Context, input Shift) (int, error) {
	return s.repo.OpenShift(ctx, input)
}

func (s *service) GetActive(ctx context.Context, userID int) (*Shift, error) {
	return s.repo.GetActiveShift(ctx, userID)
}

func (s *service) Close(ctx context.Context, input CloseShiftInput) (*ShiftSummary, error) {
	return s.repo.CloseShift(ctx, input)
}
