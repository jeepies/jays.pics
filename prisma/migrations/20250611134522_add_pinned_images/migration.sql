-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pinned_images" TEXT[] DEFAULT ARRAY[]::TEXT[];
