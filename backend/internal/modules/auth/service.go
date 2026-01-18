package auth

import (
	"database/sql" // Tambahkan ini
	"errors"

	"github.com/MasaSensei/pos-admin/internal/modules/user"
	"github.com/MasaSensei/pos-admin/internal/shared/utils"
)

type Service interface {
	Login(username, password string) (*LoginResponse, error)
}

type service struct {
	userRepo user.Repository
	db       *sql.DB // Tambahkan DB di sini
}

type LoginResponse struct {
	Token         string `json:"token"`
	UserID        int    `json:"user_id"`
	Username      string `json:"username"`
	OutletID      int    `json:"outlet_id"`
	Role          string `json:"role"`
	ActiveShiftID *int   `json:"active_shift_id"` // Field baru untuk Frontend
}

// Update constructor untuk menerima db
func NewService(repo user.Repository, db *sql.DB) Service {
	return &service{
		userRepo: repo,
		db:       db,
	}
}

func (s *service) Login(username, password string) (*LoginResponse, error) {
	u, err := s.userRepo.GetByUsername(username)
	if err != nil {
		return nil, errors.New("username atau password salah")
	}

	if !utils.CheckPasswordHash(password, u.PasswordHash) {
		return nil, errors.New("username atau password salah")
	}

	// --- LOGIKA CEK SHIFT AKTIF ---
	var activeShiftID *int
	query := `SELECT id FROM shifts WHERE user_id = ? AND status = 'OPEN' LIMIT 1`
	err = s.db.QueryRow(query, u.ID).Scan(&activeShiftID)

	if err == sql.ErrNoRows {
		activeShiftID = nil // User belum buka shift
	}
	// ------------------------------

	token, err := utils.GenerateToken(u.ID, u.Role, u.OutletID)
	if err != nil {
		return nil, err
	}

	return &LoginResponse{
		Token:         token,
		UserID:        u.ID,
		Username:      u.Username,
		OutletID:      u.OutletID,
		Role:          u.Role,
		ActiveShiftID: activeShiftID, // Kirim ke frontend
	}, nil
}
