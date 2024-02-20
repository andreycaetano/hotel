/*
  Warnings:

  - You are about to drop the column `addressId` on the `Hotel` table. All the data in the column will be lost.
  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cityId` to the `Hotel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_citiesId_fkey";

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_countryId_fkey";

-- DropForeignKey
ALTER TABLE "Hotel" DROP CONSTRAINT "Hotel_addressId_fkey";

-- AlterTable
ALTER TABLE "Hotel" DROP COLUMN "addressId",
ADD COLUMN     "cityId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Address";

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "Cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
