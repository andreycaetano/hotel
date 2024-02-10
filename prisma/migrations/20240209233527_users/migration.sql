/*
  Warnings:

  - You are about to drop the column `grade_avarenge` on the `hotel` table. All the data in the column will be lost.
  - You are about to drop the `images` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `icon` to the `facilities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `star` to the `hotel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "facilities" ADD COLUMN     "icon" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "hotel" DROP COLUMN "grade_avarenge",
ADD COLUMN     "star" INTEGER NOT NULL,
ALTER COLUMN "images" SET DEFAULT ARRAY[]::TEXT[];

-- DropTable
DROP TABLE "images";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
