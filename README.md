# ☕ POS Admin Dashboard – Toko Kopi

Dokumen ini menjadi **pegangan utama desain & arsitektur** untuk sistem **Admin Dashboard POS Toko Kopi**.

> Fokus: **Backend dulu (Fiber + SQL)** dengan **Frontend SPA menggunakan Preact**.

---

## 🎯 Tujuan Sistem

Menyediakan **Admin Dashboard POS** untuk toko kopi yang mencakup:

- Manajemen kasir & shift
- Transaksi penjualan
- Menu & kategori
- Inventaris & resep
- Laporan & sinkronisasi data

Sistem ini dirancang **ringan, modular, dan mudah dikembangkan**.

---

## 🧱 Tech Stack

### Backend

- **Go + Fiber** (API-only backend)
- **SQLite** (fase awal, mudah dipindah ke PostgreSQL/MySQL)
- **database/sql** (tanpa ORM)
- **SQL Migration manual**

### Frontend

- **Preact (SPA / CSR)**
- Fetch API / Axios
- Backend & frontend **dipisah total**

---

## 🧠 Prinsip Arsitektur

- **Domain-based modular structure** (berdasarkan ERD)
- Setiap modul punya:

  - handler (HTTP)
  - service (business logic)
  - repository (SQL)

- Backend **tidak render HTML**
- Semua response backend berbentuk **JSON**

---

## 📁 Struktur Folder Backend

```
/cmd/server/main.go

/internal
├── app/
│   ├── app.go          # bootstrap app
│   ├── routes.go       # register routes
│   └── middleware.go
│
├── config/
│   └── database.go     # config & connection
│
├── shared/
│   └── database/
│       ├── db.go       # open db connection
│       └── migrate.go  # migration runner
│
├── modules/
│   ├── auth/
│   │   ├── handler.go
│   │   ├── service.go
│   │   ├── repository.go
│   │   └── routes.go
│   │
│   ├── users/
│   ├── shifts/
│   ├── transactions/
│   ├── inventory/
│   └── settings/

/db
├── migrations/
│   ├── 001_create_users.sql
│   ├── 002_create_shifts.sql
│   └── ...
└── pos.db
```

---

## 📁 Struktur Folder Frontend (Preact)

```
/web
├── src/
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   └── Transactions.tsx
│   │
│   ├── components/
│   ├── services/
│   │   └── api.ts      # wrapper fetch API
│   │
│   └── main.tsx
```

---

## 🗄️ Database & Migration

### Lokasi Migration

```
/db/migrations/
```

### Tabel Wajib

- `schema_migrations`
- `users`
- `shifts`
- `transactions`
- `transaction_items`
- `menus`
- `ingredients`

Migration dijalankan **saat app start** via kode Go.

---

## 🔐 Authentication (Rencana)

- Login via JSON API
- Backend return token (JWT / session token)
- Frontend Preact simpan token
- Semua request protected pakai middleware

---

## 🚀 Alur Pengembangan

1. Buat migration SQL
2. Jalankan backend (auto migrate)
3. Buat repository → service → handler
4. Konsumsi API dari Preact

---

## 🧭 Catatan Penting

- Tidak menggunakan HTMX
- Tidak menggunakan ORM
- Tidak mencampur frontend & backend
- Struktur ini **sengaja dibuat sederhana & scalable**

---

## ☕ Filosofi

> "Lebih baik backend sederhana tapi rapi, daripada cepat tapi berantakan."

Dokumen ini menjadi **single source of truth** untuk proyek POS Admin Dashboard ini.
