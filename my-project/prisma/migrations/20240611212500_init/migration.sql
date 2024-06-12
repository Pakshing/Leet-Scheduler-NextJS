/*
  Warnings:

  - Made the column `lastCompletion` on table `Question` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "lastCompletion" SET NOT NULL,
ALTER COLUMN "lastCompletion" SET DEFAULT CURRENT_TIMESTAMP;
