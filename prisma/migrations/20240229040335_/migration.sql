/*
  Warnings:

  - Added the required column `imageId` to the `Hotel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hotel" ADD COLUMN     "imageId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Images" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Images"("id") ON DELETE CASCADE ON UPDATE CASCADE;
