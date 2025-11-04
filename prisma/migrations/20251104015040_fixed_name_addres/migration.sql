/*
  Warnings:

  - The primary key for the `Devices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `mac_adress` on the `Devices` table. All the data in the column will be lost.
  - You are about to drop the column `devicesMac_adress` on the `Historic` table. All the data in the column will be lost.
  - Added the required column `mac_address` to the `Devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `devicesMac_address` to the `Historic` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Historic" DROP CONSTRAINT "Historic_devicesMac_adress_fkey";

-- DropForeignKey
ALTER TABLE "public"."Readings" DROP CONSTRAINT "Readings_devicesMac_address_fkey";

-- AlterTable
ALTER TABLE "Devices" DROP CONSTRAINT "Devices_pkey",
DROP COLUMN "mac_adress",
ADD COLUMN     "mac_address" TEXT NOT NULL,
ADD CONSTRAINT "Devices_pkey" PRIMARY KEY ("mac_address");

-- AlterTable
ALTER TABLE "Historic" DROP COLUMN "devicesMac_adress",
ADD COLUMN     "devicesMac_address" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Readings" ADD CONSTRAINT "Readings_devicesMac_address_fkey" FOREIGN KEY ("devicesMac_address") REFERENCES "Devices"("mac_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historic" ADD CONSTRAINT "Historic_devicesMac_address_fkey" FOREIGN KEY ("devicesMac_address") REFERENCES "Devices"("mac_address") ON DELETE RESTRICT ON UPDATE CASCADE;
