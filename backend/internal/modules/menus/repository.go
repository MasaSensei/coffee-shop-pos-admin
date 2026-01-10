package menus

import (
	"database/sql"
	"strconv"
	"strings"
)

type Repository interface {
	Fetch(offset, limit int) ([]Menu, int, error)
	Create(m Menu) (int, error)
	Update(id int, m Menu) error
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository { return &repository{db} }

func (r *repository) Fetch(offset, limit int) ([]Menu, int, error) {
	var total int
	r.db.QueryRow(`SELECT COUNT(*) FROM menus`).Scan(&total)

	// Query sakti: Ambil menu, nama kategori, dan gabungkan variannya
	query := `
        SELECT 
            m.id, m.category_id, c.name as category_name, 
            m.name, m.description, m.is_active,
            COALESCE(GROUP_CONCAT(pv.id || '|' || pv.variant_name || '|' || pv.price, ';'), '') as variants_raw
        FROM menus m
        LEFT JOIN categories c ON m.category_id = c.id
        LEFT JOIN menu_variants pv ON m.id = pv.menu_id
        GROUP BY m.id
        LIMIT ? OFFSET ?`

	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var res []Menu
	for rows.Next() {
		var m Menu
		var variantsRaw string

		// Scan data (Pastikan struct Menu kamu punya field CategoryName dan Variants)
		err := rows.Scan(&m.ID, &m.CategoryID, &m.CategoryName, &m.Name, &m.Description, &m.IsActive, &variantsRaw)
		if err != nil {
			return nil, 0, err
		}

		// Parsing string "ID|Name|Price;ID|Name|Price" menjadi Slice of Struct
		if variantsRaw != "" {
			vStrings := strings.Split(variantsRaw, ";")
			for _, vStr := range vStrings {
				p := strings.Split(vStr, "|")
				if len(p) == 3 {
					price, _ := strconv.ParseFloat(p[2], 64)
					m.Variants = append(m.Variants, Variant{
						ID:    p[0],
						Name:  p[1],
						Price: price,
					})
				}
			}
		}

		res = append(res, m)
	}
	return res, total, nil
}

func (r *repository) Create(m Menu) (int, error) {
	// 1. Mulai Transaksi
	tx, err := r.db.Begin()
	if err != nil {
		return 0, err
	}

	// 2. Insert ke tabel menus
	queryMenu := `INSERT INTO menus (category_id, name, description, is_active) VALUES (?, ?, ?, ?)`
	res, err := tx.Exec(queryMenu, m.CategoryID, m.Name, m.Description, m.IsActive)
	if err != nil {
		tx.Rollback() // Batalkan jika gagal
		return 0, err
	}

	menuID, _ := res.LastInsertId()

	// 3. Insert semua variant (Looping)
	queryVariant := `INSERT INTO menu_variants (menu_id, variant_name, price) VALUES (?, ?, ?)`
	for _, v := range m.Variants {
		_, err := tx.Exec(queryVariant, menuID, v.Name, v.Price)
		if err != nil {
			tx.Rollback() // Batalkan seluruhnya jika salah satu variant gagal
			return 0, err
		}
	}

	// 4. Commit Transaksi jika semua berhasil
	err = tx.Commit()
	if err != nil {
		return 0, err
	}

	return int(menuID), nil
}

func (r *repository) Update(id int, m Menu) error {
	// 1. Mulai Transaksi
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}

	// 2. Update data utama menu
	queryMenu := `UPDATE menus SET category_id = ?, name = ?, description = ?, is_active = ? WHERE id = ?`
	_, err = tx.Exec(queryMenu, m.CategoryID, m.Name, m.Description, m.IsActive, id)
	if err != nil {
		tx.Rollback()
		return err
	}

	// 3. Hapus semua varian lama milik menu ini
	_, err = tx.Exec(`DELETE FROM menu_variants WHERE menu_id = ?`, id)
	if err != nil {
		tx.Rollback()
		return err
	}

	// 4. Insert ulang semua varian (termasuk yang baru ditambah dari FE)
	queryVariant := `INSERT INTO menu_variants (menu_id, variant_name, price) VALUES (?, ?, ?)`
	for _, v := range m.Variants {
		_, err := tx.Exec(queryVariant, id, v.Name, v.Price)
		if err != nil {
			tx.Rollback()
			return err
		}
	}

	// 5. Commit
	return tx.Commit()
}
