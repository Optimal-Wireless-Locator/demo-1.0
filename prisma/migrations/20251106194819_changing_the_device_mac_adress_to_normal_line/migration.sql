-- DropForeignKey
ALTER TABLE "public"."Historic" DROP CONSTRAINT "Historic_devicesMac_address_fkey";

-- DropForeignKey
ALTER TABLE "public"."Readings" DROP CONSTRAINT "Readings_devicesMac_address_fkey";
