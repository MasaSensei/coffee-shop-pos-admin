CREATE TABLE transaction_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    transaction_id INTEGER NOT NULL,
    payment_method_id INTEGER NOT NULL,

    amount DECIMAL(12,2) NOT NULL,

    FOREIGN KEY (transaction_id) REFERENCES transactions(id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
);
