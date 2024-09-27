/*
  Warnings:

  - You are about to drop the column `uploader_key` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[upload_key]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - The required column `upload_key` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX `User_uploader_key_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `uploader_key`,
    ADD COLUMN `upload_key` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_upload_key_key` ON `User`(`upload_key`);
