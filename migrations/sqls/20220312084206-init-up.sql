/* Replace with your SQL commands */

CREATE TABLE orders (
    id             text        NOT NULL PRIMARY KEY,
    contract_price number,
    kind           text        NOT NULL,
    status         text        NOT NULL,
    side           text        NOT NULL,
    updated_at     TIMESTAMPTZ NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL
);
