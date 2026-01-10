CREATE TABLE recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    menu_variant_id INTEGER NOT NULL,
    ingredient_id INTEGER NOT NULL,
    quantity_needed REAL NOT NULL,
    FOREIGN KEY (menu_variant_id) REFERENCES menu_variants(id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
);