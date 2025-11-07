/*
  Warnings:

  - Added the required column `place_name` to the `Historic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Historic" ADD COLUMN     "place_name" TEXT NOT NULL;
