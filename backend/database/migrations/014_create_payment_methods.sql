CREATE TABLE payment_methods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, -- Cash / QRIS / Debit
    type TEXT NOT NULL -- Tunai / Digital
);