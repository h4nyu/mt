CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- CreateTable
CREATE TABLE "Board" (
    "code" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION,
    "sign" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "askSign" TEXT,
    "bidSign" TEXT,
    "overQuantity" INTEGER,
    "underQuantity" INTEGER,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("code","time")
);


-- CreateTable
CREATE TABLE "BoardRow" (
    "code" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "BoardRow_pkey" PRIMARY KEY ("code","time","kind","order")
);

SELECT create_hypertable('"Board"', 'time');
SELECT create_hypertable('"BoardRow"', 'time');
