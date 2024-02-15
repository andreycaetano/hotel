/*
  Warnings:

  - You are about to drop the `_FacilitiesToHotel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FacilitiesToHotel" DROP CONSTRAINT "_FacilitiesToHotel_A_fkey";

-- DropForeignKey
ALTER TABLE "_FacilitiesToHotel" DROP CONSTRAINT "_FacilitiesToHotel_B_fkey";

-- DropTable
DROP TABLE "_FacilitiesToHotel";

-- CreateTable
CREATE TABLE "FacilitiesOnHotel" (
    "hotelId" INTEGER NOT NULL,
    "facilitiesId" INTEGER NOT NULL,

    CONSTRAINT "FacilitiesOnHotel_pkey" PRIMARY KEY ("facilitiesId","hotelId")
);

-- AddForeignKey
ALTER TABLE "FacilitiesOnHotel" ADD CONSTRAINT "FacilitiesOnHotel_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacilitiesOnHotel" ADD CONSTRAINT "FacilitiesOnHotel_facilitiesId_fkey" FOREIGN KEY ("facilitiesId") REFERENCES "Facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
