/*
  Warnings:

  - You are about to drop the column `meters` on the `Readings` table. All the data in the column will be lost.
  - Added the required column `calculation_inputs` to the `Historic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Historic" ADD COLUMN     "calculation_inputs" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Readings" DROP COLUMN "meters";
