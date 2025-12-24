CREATE TABLE stock_histories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    ingredient_id INTEGER NOT NULL,

    type VARCHAR(10) NOT NULL,  -- IN / OUT / ADJ / WASTE
    quantity REAL NOT NULL,     -- positif / negatif

    cost_price DECIMAL(12,2),

    ref_type VARCHAR(30),       -- transaction, adjustment
    ref_id INTEGER,

    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
