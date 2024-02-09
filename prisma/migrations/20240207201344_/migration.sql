/*
  Warnings:

  - Made the column `description` on table `hotel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "hotel" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "facilities" SET DEFAULT ARRAY[]::INTEGER[],
ALTER COLUMN "grade_avarenge" SET DEFAULT 0;
