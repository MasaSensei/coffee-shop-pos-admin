package sales

import (
	"context"
	"fmt"
	"time"
)

type Service interface {
	Checkout(ctx context.Context, input Transaction) (int, error)
}

type service struct {
	repo Repository
	// Kita nanti butuh akses ke repo ingredients untuk ambil harga modal (HPP)
	// Tapi untuk sekarang kita asumsikan hitungan di Repo sudah cukup
}

func NewService(repo Repository) Service { return &service{repo} }

func (s *service) Checkout(ctx context.Context, t Transaction) (int, error) {
	// 1. Logic: Generate Invoice Number profesional
	t.InvoiceNo = fmt.Sprintf("INV/%s/%d", time.Now().Format("20060102"), time.Now().Unix())

	// 2. Logic: Hitung hitungan uang
	t.Subtotal = 0
	for i, item := range t.Items {
		// Hitung subtotal per item
		itemSubtotal := float64(item.Qty) * item.PriceAtSale
		t.Items[i].CostAtSale = 0 // Nanti bisa diisi dari avg_cost_price bahan
		t.Subtotal += itemSubtotal
	}

	// Hitung Grand Total (Contoh Tax 11%)
	t.TaxAmount = t.Subtotal * 0.11
	t.GrandTotal = t.Subtotal + t.TaxAmount - t.DiscountAmount

	// 3. Logic: Hitung Kembalian & Validasi Pembayaran
	if t.AmountPaid < t.GrandTotal {
		return 0, fmt.Errorf("pembayaran kurang! total: %.2f, dibayar: %.2f", t.GrandTotal, t.AmountPaid)
	}
	t.ChangeAmount = t.AmountPaid - t.GrandTotal

	// 4. Default Status
	t.Status = "PAID"
	t.CreatedAt = time.Now()

	return s.repo.CreateTransaction(ctx, t)
}
