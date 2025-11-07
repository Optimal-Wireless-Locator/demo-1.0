/*
  Warnings:

  - The primary key for the `Places` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `place_name` to the `Readings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Places" DROP CONSTRAINT "Places_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Places_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Places_id_seq";

-- AlterTable
ALTER TABLE "Readings" ADD COLUMN     "place_name" TEXT NOT NULL;
