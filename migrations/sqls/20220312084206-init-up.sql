CREATE TABLE orders (
    id             text        NOT NULL PRIMARY KEY,
    contract_price double precision,
    price          double precision,
    symbol_id      text,
    kind           text        NOT NULL,
    status         text        NOT NULL,
    side           text        NOT NULL,
    updated_at     TIMESTAMPTZ NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL
);

CREATE TABLE tickers (
    ask    double precision NOT NULL,
    bid    double precision NOT NULL,
    high   double precision NOT NULL,
    last   double precision NOT NULL,
    low    double precision NOT NULL,
    volume double precision NOT NULL,
    symbol text        NOT NULL,
    ts     TIMESTAMPTZ NOT NULL
);

SELECT create_hypertable('tickers', 'ts');
