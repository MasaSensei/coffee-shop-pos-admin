CREATE TABLE transaction_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id INTEGER NOT NULL,
    menu_variant_id INTEGER NOT NULL,
    qty INTEGER NOT NULL,
    price_at_sale REAL NOT NULL,
    cost_at_sale REAL, -- HPP saat kejadian
    FOREIGN KEY (transaction_id) REFERENCES transactions(id),
    FOREIGN KEY (menu_variant_id) REFERENCES menu_variants(id)
);