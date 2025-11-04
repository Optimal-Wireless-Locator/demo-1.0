/*
  Warnings:

  - You are about to drop the column `devicesMac_adress` on the `Readings` table. All the data in the column will be lost.
  - Added the required column `one_meter_rssi` to the `Places` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propagation_factor` to the `Places` table without a default value. This is not possible if the table is not empty.
  - Added the required column `devicesMac_address` to the `Readings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Readings" DROP CONSTRAINT "Readings_devicesMac_adress_fkey";

-- AlterTable
ALTER TABLE "Places" ADD COLUMN     "one_meter_rssi" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "propagation_factor" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Readings" DROP COLUMN "devicesMac_adress",
ADD COLUMN     "devicesMac_address" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Readings" ADD CONSTRAINT "Readings_devicesMac_address_fkey" FOREIGN KEY ("devicesMac_address") REFERENCES "Devices"("mac_adress") ON DELETE RESTRICT ON UPDATE CASCADE;
