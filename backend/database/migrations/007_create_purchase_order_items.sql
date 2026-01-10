CREATE TABLE purchase_order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    purchase_order_id INTEGER NOT NULL,
    ingredient_id INTEGER NOT NULL,
    qty_received REAL NOT NULL,
    cost_per_unit REAL NOT NULL,
    subtotal REAL NOT NULL,
    FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
);