/*
  Warnings:

  - Added the required column `updatedAt` to the `Board` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Board_time_idx";

-- DropIndex
DROP INDEX "BoardRow_time_idx";

-- AlterTable
ALTER TABLE "Board" ADD COLUMN "updatedAt" TIMESTAMP(3);
UPDATE "Board" SET "updatedAt" = "createdAt";
ALTER TABLE "Board" ALTER COLUMN "updatedAt" SET NOT NULL;
