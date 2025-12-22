CREATE TABLE IF NOT EXISTS shifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    opened_at DATETIME NOT NULL,
    closed_at DATETIME,
    opening_cash REAL NOT NULL,
    closing_cash REAL,
    total_sales REAL DEFAULT 0,

    FOREIGN KEY (user_id) REFERENCES users(id)
);
