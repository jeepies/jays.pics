/*
  Warnings:

  - Added the required column `privacy` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ImagePrivacy" AS ENUM ('PUBLIC', 'UNLISTED', 'PRIVATE');

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "privacy" "ImagePrivacy" NOT NULL;
