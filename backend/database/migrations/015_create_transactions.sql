-- Jika tabel sudah ada, kita hapus dan buat ulang dengan status yang lebih fleksibel
DROP TABLE IF EXISTS transactions;

CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_no TEXT NOT NULL UNIQUE,
    queue_number INTEGER,
    shift_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    customer_id INTEGER,
    payment_method_id INTEGER NOT NULL,
    order_source TEXT NOT NULL,
    order_type TEXT NOT NULL,
    subtotal REAL NOT NULL,
    tax_amount REAL DEFAULT 0,
    discount_amount REAL DEFAULT 0,
    grand_total REAL NOT NULL,
    amount_paid REAL NOT NULL,
    change_amount REAL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'PAID', 'COMPLETED', 'VOID', 'REFUND')) DEFAULT 'PENDING',
    payment_reference TEXT,
    qr_string TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shift_id) REFERENCES shifts(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
);