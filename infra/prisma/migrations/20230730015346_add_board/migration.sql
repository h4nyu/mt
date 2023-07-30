-- CreateTable
CREATE TABLE "Board" (
    "symbol" TEXT NOT NULL,
    "exchange" TEXT,
    "currentTime" TIMESTAMP(3) NOT NULL,
    "currentPrice" DOUBLE PRECISION NOT NULL,
    "currentSign" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "askSign" TEXT,
    "bidSign" TEXT,
    "overQuantity" INTEGER,
    "underQuantity" INTEGER,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("symbol","currentTime")
);

-- CreateTable
CREATE TABLE "BoardRow" (
    "symbol" TEXT NOT NULL,
    "currentTime" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "BoardRow_pkey" PRIMARY KEY ("symbol","currentTime","kind","order")
);
