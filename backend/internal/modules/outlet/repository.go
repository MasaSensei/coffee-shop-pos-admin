package outlet

import (
	"database/sql"
)

type Repository interface {
	Insert(o Outlet) (int64, error)
	FindAll(page, limit int) ([]Outlet, int, error)
	GetDetail(id int, shiftPage, shiftLimit int) (*OutletDetailResponse, int, error)
}

type repository struct {
	DB *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{DB: db}
}

func (r *repository) Insert(o Outlet) (int64, error) {
	query := `INSERT INTO outlets (name, address, phone, is_active) VALUES (?, ?, ?, 1)`
	res, err := r.DB.Exec(query, o.Name, o.Address, o.Phone)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

func (r *repository) FindAll(page, limit int) ([]Outlet, int, error) {
	var outlets []Outlet
	var total int

	// 1. Hitung total semua data (tanpa limit) untuk kebutuhan Meta
	err := r.DB.QueryRow("SELECT COUNT(*) FROM outlets").Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// 2. Ambil data dengan LIMIT dan OFFSET
	offset := (page - 1) * limit
	query := `SELECT id, name, address, phone, is_active FROM outlets LIMIT ? OFFSET ?`

	rows, err := r.DB.Query(query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	for rows.Next() {
		var o Outlet
		if err := rows.Scan(&o.ID, &o.Name, &o.Address, &o.Phone, &o.IsActive); err != nil {
			return nil, 0, err
		}
		outlets = append(outlets, o)
	}

	return outlets, total, nil
}

func (r *repository) GetDetail(id int, shiftPage, shiftLimit int) (*OutletDetailResponse, int, error) {
	var detail OutletDetailResponse
	var totalShifts int

	// 1. Ambil Data Dasar Outlet
	query := `SELECT id, name, address, phone, is_active FROM outlets WHERE id = ?`
	err := r.DB.QueryRow(query, id).Scan(&detail.ID, &detail.Name, &detail.Address, &detail.Phone, &detail.IsActive)
	if err != nil {
		return nil, 0, err
	}

	// 2. Ambil Manager (Role 'Manager' sesuai skema users)
	queryMgr := `SELECT id, name, role FROM users WHERE outlet_id = ? AND role = 'Manager' LIMIT 1`
	var mgr Staff
	errMgr := r.DB.QueryRow(queryMgr, id).Scan(&mgr.ID, &mgr.Name, &mgr.Role)
	if errMgr == nil {
		detail.Manager = &mgr
	}

	// 3. Ambil Tim Staff (Selain Manager)
	queryStaffs := `SELECT id, name, role FROM users WHERE outlet_id = ? AND role != 'Manager'`
	rowsStaff, err := r.DB.Query(queryStaffs, id)
	if err == nil {
		defer rowsStaff.Close()
		for rowsStaff.Next() {
			var s Staff
			rowsStaff.Scan(&s.ID, &s.Name, &s.Role)
			detail.Staffs = append(detail.Staffs, s)
		}
	}

	// 4. Ambil Riwayat Shift (SESUAI TABEL SHIFTS BARU)
	r.DB.QueryRow("SELECT COUNT(*) FROM shifts WHERE outlet_id = ?", id).Scan(&totalShifts)

	offset := (shiftPage - 1) * shiftLimit
	queryShifts := `
        SELECT 
            s.id, 
            u.name as barista_name, 
            s.opened_at, 
            s.discrepancy,
            s.note
        FROM shifts s
        JOIN users u ON s.user_id = u.id
        WHERE s.outlet_id = ? 
        ORDER BY s.opened_at DESC 
        LIMIT ? OFFSET ?`

	rowsShift, err := r.DB.Query(queryShifts, id, shiftLimit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rowsShift.Close()

	for rowsShift.Next() {
		var sh Shift
		// Scan harus urut sesuai urutan SELECT di atas
		if err := rowsShift.Scan(&sh.ID, &sh.Barista, &sh.OpenedAt, &sh.Discrepancy, &sh.Note); err != nil {
			continue
		}
		detail.Shifts = append(detail.Shifts, sh)
	}

	return &detail, totalShifts, nil
}
