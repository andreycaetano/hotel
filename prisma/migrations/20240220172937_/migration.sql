-- DropForeignKey
ALTER TABLE "Hotel" DROP CONSTRAINT "Hotel_descriptionId_fkey";

-- AlterTable
ALTER TABLE "Hotel" ALTER COLUMN "star" DROP DEFAULT,
ALTER COLUMN "addressId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_descriptionId_fkey" FOREIGN KEY ("descriptionId") REFERENCES "Description"("id") ON DELETE CASCADE ON UPDATE CASCADE;
