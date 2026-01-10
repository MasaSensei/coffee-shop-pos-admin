CREATE TABLE purchase_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL, -- Staff penerima
    outlet_id INTEGER NOT NULL,
    po_number TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'RECEIVED', 'CANCELLED')) DEFAULT 'PENDING',
    total_cost REAL DEFAULT 0,
    received_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (outlet_id) REFERENCES outlets(id)
);