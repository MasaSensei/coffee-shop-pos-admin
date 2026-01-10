CREATE TABLE ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    outlet_id INTEGER NOT NULL,
    name TEXT NOT NULL, -- Contoh: Susu / Biji Kopi
    unit TEXT NOT NULL, -- gram / ml / pcs
    stock_qty REAL DEFAULT 0,
    avg_cost_price REAL DEFAULT 0, -- HPP rata-rata
    FOREIGN KEY (outlet_id) REFERENCES outlets(id)
);