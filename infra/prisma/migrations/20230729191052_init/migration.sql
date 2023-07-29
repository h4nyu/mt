CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;
-- CreateTable
CREATE TABLE "Board" (
    "symbol" TEXT NOT NULL,
    "exchange" TEXT,
    "currentTime" TIMESTAMP(3) NOT NULL,
    "currentPrice" DOUBLE PRECISION NOT NULL,
    "currentSign" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sellSign" TEXT,
    "buySign" TEXT,
    "overSellQuantity" INTEGER,
    "underBuyQuantity" INTEGER,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("symbol","currentTime")
);

-- CreateTable
CREATE TABLE "BoardRow" (
    "symbol" TEXT NOT NULL,
    "currentTime" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION,
    "quantity" INTEGER,
    "kind" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "BoardRow_pkey" PRIMARY KEY ("symbol","currentTime","kind","order")
);

-- AddForeignKey
ALTER TABLE "BoardRow" ADD CONSTRAINT "BoardRow_symbol_currentTime_fkey" FOREIGN KEY ("symbol", "currentTime") REFERENCES "Board"("symbol", "currentTime") ON DELETE RESTRICT ON UPDATE CASCADE;

SELECT create_hypertable('"Board"', 'currentTime');
SELECT create_hypertable('"BoardRow"', 'currentTime');
