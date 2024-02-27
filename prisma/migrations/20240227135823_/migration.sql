-- CreateTable
CREATE TABLE "Hotel" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "descriptionId" INTEGER NOT NULL,
    "star" INTEGER NOT NULL,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "cityId" INTEGER NOT NULL,
    "conditionId" INTEGER NOT NULL,
    "travelTimeId" INTEGER NOT NULL,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conditions" (
    "id" SERIAL NOT NULL,
    "condition" TEXT NOT NULL,

    CONSTRAINT "Conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelTime" (
    "id" SERIAL NOT NULL,
    "travelTime" TEXT NOT NULL,

    CONSTRAINT "TravelTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sports" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Sports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facilities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "Facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "countryId" INTEGER NOT NULL,

    CONSTRAINT "Cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Description" (
    "id" SERIAL NOT NULL,
    "comment" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "accommodation" TEXT NOT NULL,
    "activities" TEXT NOT NULL,

    CONSTRAINT "Description_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_HotelToSports" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_FacilitiesToHotel" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Conditions_condition_key" ON "Conditions"("condition");

-- CreateIndex
CREATE UNIQUE INDEX "TravelTime_travelTime_key" ON "TravelTime"("travelTime");

-- CreateIndex
CREATE UNIQUE INDEX "Sports_name_key" ON "Sports"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_HotelToSports_AB_unique" ON "_HotelToSports"("A", "B");

-- CreateIndex
CREATE INDEX "_HotelToSports_B_index" ON "_HotelToSports"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FacilitiesToHotel_AB_unique" ON "_FacilitiesToHotel"("A", "B");

-- CreateIndex
CREATE INDEX "_FacilitiesToHotel_B_index" ON "_FacilitiesToHotel"("B");

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_descriptionId_fkey" FOREIGN KEY ("descriptionId") REFERENCES "Description"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "Cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Conditions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_travelTimeId_fkey" FOREIGN KEY ("travelTimeId") REFERENCES "TravelTime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cities" ADD CONSTRAINT "Cities_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HotelToSports" ADD CONSTRAINT "_HotelToSports_A_fkey" FOREIGN KEY ("A") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HotelToSports" ADD CONSTRAINT "_HotelToSports_B_fkey" FOREIGN KEY ("B") REFERENCES "Sports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacilitiesToHotel" ADD CONSTRAINT "_FacilitiesToHotel_A_fkey" FOREIGN KEY ("A") REFERENCES "Facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacilitiesToHotel" ADD CONSTRAINT "_FacilitiesToHotel_B_fkey" FOREIGN KEY ("B") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
