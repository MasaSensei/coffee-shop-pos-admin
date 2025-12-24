CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_no VARCHAR(50) NOT NULL UNIQUE,

    shift_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,

    subtotal DECIMAL(12,2) NOT NULL,
    discount DECIMAL(12,2) DEFAULT 0,
    tax DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',

    note TEXT,
    synced BOOLEAN DEFAULT 0,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (shift_id) REFERENCES shifts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
