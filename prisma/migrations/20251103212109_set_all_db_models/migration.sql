/*
  Warnings:

  - You are about to drop the `MacAdress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."MacAdress";

-- CreateTable
CREATE TABLE "Devices" (
    "mac_adress" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Devices_pkey" PRIMARY KEY ("mac_adress")
);

-- CreateTable
CREATE TABLE "Places" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "esp_positions" TEXT NOT NULL,

    CONSTRAINT "Places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Readings" (
    "id" SERIAL NOT NULL,
    "esp32" TEXT NOT NULL,
    "rssi" INTEGER NOT NULL,
    "meters" DOUBLE PRECISION NOT NULL,
    "read_at" TIMESTAMP(3) NOT NULL,
    "devicesMac_adress" TEXT NOT NULL,

    CONSTRAINT "Readings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Historic" (
    "id" SERIAL NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "tracked_at" TIMESTAMP(3) NOT NULL,
    "devicesMac_adress" TEXT NOT NULL,

    CONSTRAINT "Historic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Places_name_key" ON "Places"("name");

-- AddForeignKey
ALTER TABLE "Readings" ADD CONSTRAINT "Readings_devicesMac_adress_fkey" FOREIGN KEY ("devicesMac_adress") REFERENCES "Devices"("mac_adress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historic" ADD CONSTRAINT "Historic_devicesMac_adress_fkey" FOREIGN KEY ("devicesMac_adress") REFERENCES "Devices"("mac_adress") ON DELETE RESTRICT ON UPDATE CASCADE;
