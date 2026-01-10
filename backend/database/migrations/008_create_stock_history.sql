CREATE TABLE stock_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ingredient_id INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('SALE', 'PURCHASE', 'WASTE', 'ADJUST')),
    quantity REAL NOT NULL, -- Positif untuk masuk, Negatif untuk keluar
    reference_id INTEGER, -- ID Transaksi atau ID PO
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
);