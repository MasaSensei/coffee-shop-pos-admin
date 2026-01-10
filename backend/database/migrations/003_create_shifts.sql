CREATE TABLE shifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    outlet_id INTEGER NOT NULL,
    opened_at DATETIME NOT NULL,
    closed_at DATETIME,
    opening_cash REAL DEFAULT 0,
    expected_closing_cash REAL DEFAULT 0,
    actual_closing_cash REAL DEFAULT 0,
    discrepancy REAL DEFAULT 0, -- Selisih
    note TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (outlet_id) REFERENCES outlets(id)
);