package purchasing

import (
	"context"
	"fmt"
	"time"

	"github.com/MasaSensei/pos-admin/internal/shared/utils"
)

type Service interface {
	CreateOrder(ctx context.Context, input PurchaseOrder) (int, error)
	GetOrders(ctx context.Context, page, limit int) (utils.PaginatedResponse, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service { return &service{repo} }

func (s *service) CreateOrder(ctx context.Context, po PurchaseOrder) (int, error) {
	if po.PONumber == "" {
		po.PONumber = fmt.Sprintf("PO-%d", time.Now().Unix())
	}

	var total float64
	for i, item := range po.Items {
		po.Items[i].Subtotal = item.QtyReceived * item.CostPerUnit
		total += po.Items[i].Subtotal
	}
	po.TotalCost = total

	return s.repo.CreateOrder(ctx, po)
}

func (s *service) GetOrders(ctx context.Context, page, limit int) (utils.PaginatedResponse, error) {
	offset := (page - 1) * limit
	data, total, err := s.repo.FetchAll(ctx, offset, limit)
	if err != nil {
		return utils.PaginatedResponse{}, err
	}

	return utils.PaginatedResponse{
		Data: data,
		Meta: utils.CreateMeta(total, page, limit),
	}, nil
}
