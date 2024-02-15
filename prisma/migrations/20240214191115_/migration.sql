/*
  Warnings:

  - You are about to drop the column `country` on the `Country` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `State` table. All the data in the column will be lost.
  - Added the required column `name` to the `Country` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `State` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Country" DROP COLUMN "country",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "State" DROP COLUMN "state",
ADD COLUMN     "name" TEXT NOT NULL;
