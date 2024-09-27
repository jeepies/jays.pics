/*
  Warnings:

  - A unique constraint covering the columns `[uploader_key]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - The required column `uploader_key` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `uploader_key` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_uploader_key_key` ON `User`(`uploader_key`);
