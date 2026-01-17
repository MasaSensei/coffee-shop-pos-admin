package sales

import (
	"context"
	"fmt"
	"time"

	"github.com/MasaSensei/pos-admin/internal/shared/utils"
)

type Service interface {
	ProcessTransaction(ctx context.Context, t Transaction) (*Transaction, error)
}

type service struct {
	repo      Repository
	xenditKey string
}

func NewService(repo Repository, xenditKey string) Service {
	return &service{
		repo:      repo,
		xenditKey: xenditKey,
	}
}

func (s *service) ProcessTransaction(ctx context.Context, t Transaction) (*Transaction, error) {
	// 1. Generate Invoice No
	t.InvoiceNo = fmt.Sprintf("INV/%s/%d", time.Now().Format("20060102"), time.Now().Unix())

	// 2. Hitung Subtotal dari Items
	t.Subtotal = 0
	for i, item := range t.Items {
		itemSubtotal := float64(item.Qty) * item.PriceAtSale
		t.Items[i].CostAtSale = 0 // Opsional: Ambil dari DB jika perlu HPP
		t.Subtotal += itemSubtotal
	}

	// 3. Hitung Pajak (11%) & Grand Total
	t.TaxAmount = t.Subtotal * 0.11
	t.GrandTotal = t.Subtotal + t.TaxAmount - t.DiscountAmount

	// 4. LOGIC PEMBAYARAN BERDASARKAN METODE
	if t.PaymentMethodID == 2 {
		// --- LOGIC QRIS ---
		qrRes, err := utils.CreateXenditQRIS(s.xenditKey, t.InvoiceNo, t.GrandTotal)
		if err != nil {
			return nil, fmt.Errorf("gagal generate QRIS: %v", err)
		}
		t.PaymentReference = qrRes.ID
		t.QRString = qrRes.QRString
		t.Status = "PAID" //SEHARUSNYA PENDING
		t.AmountPaid = 0  // QRIS belum dibayar saat checkout dibuat
		t.ChangeAmount = 0
	} else {
		// --- LOGIC TUNAI / CASH ---
		if t.AmountPaid < t.GrandTotal {
			return nil, fmt.Errorf("pembayaran kurang! total: %.2f, dibayar: %.2f", t.GrandTotal, t.AmountPaid)
		}
		t.ChangeAmount = t.AmountPaid - t.GrandTotal
		t.Status = "COMPLETED"
	}

	t.CreatedAt = time.Now()

	// 5. Simpan ke Database melalui Repo
	id, err := s.repo.CreateTransaction(ctx, t)
	if err != nil {
		return nil, err
	}

	t.ID = id
	return &t, nil
}
