CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_no TEXT NOT NULL UNIQUE,
    queue_number INTEGER,
    shift_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL, -- Kasir
    customer_id INTEGER, -- Bisa NULL jika Guest
    payment_method_id INTEGER NOT NULL,
    order_source TEXT NOT NULL CHECK (order_source IN ('POS_CASHIER', 'MOBILE_APP')),
    order_type TEXT NOT NULL CHECK (order_type IN ('Dine-in', 'Takeaway')),
    subtotal REAL NOT NULL,
    tax_amount REAL DEFAULT 0,
    discount_amount REAL DEFAULT 0,
    grand_total REAL NOT NULL,
    amount_paid REAL NOT NULL,
    change_amount REAL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('PAID', 'VOID', 'REFUND')) DEFAULT 'PAID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shift_id) REFERENCES shifts(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
);