/*
  Warnings:

  - You are about to drop the `FacilitiesOnHotel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FacilitiesOnHotel" DROP CONSTRAINT "FacilitiesOnHotel_facilitiesId_fkey";

-- DropForeignKey
ALTER TABLE "FacilitiesOnHotel" DROP CONSTRAINT "FacilitiesOnHotel_hotelId_fkey";

-- DropTable
DROP TABLE "FacilitiesOnHotel";

-- CreateTable
CREATE TABLE "_FacilitiesToHotel" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FacilitiesToHotel_AB_unique" ON "_FacilitiesToHotel"("A", "B");

-- CreateIndex
CREATE INDEX "_FacilitiesToHotel_B_index" ON "_FacilitiesToHotel"("B");

-- AddForeignKey
ALTER TABLE "_FacilitiesToHotel" ADD CONSTRAINT "_FacilitiesToHotel_A_fkey" FOREIGN KEY ("A") REFERENCES "Facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacilitiesToHotel" ADD CONSTRAINT "_FacilitiesToHotel_B_fkey" FOREIGN KEY ("B") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
