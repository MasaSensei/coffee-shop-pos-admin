CREATE TABLE menu_variants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    menu_id INTEGER NOT NULL,
    variant_name TEXT NOT NULL, -- Hot / Ice / Large
    price REAL NOT NULL,
    sku TEXT UNIQUE,
    FOREIGN KEY (menu_id) REFERENCES menus(id)
);