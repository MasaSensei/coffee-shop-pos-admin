CREATE TABLE transaction_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id INTEGER NOT NULL,
    menu_id INTEGER NOT NULL,

    qty INTEGER NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    total DECIMAL(12,2) NOT NULL,

    FOREIGN KEY (transaction_id) REFERENCES transactions(id),
    FOREIGN KEY (menu_id) REFERENCES menus(id)
);
