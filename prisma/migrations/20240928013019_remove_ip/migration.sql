/*
  Warnings:

  - You are about to drop the column `last_login_ip` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `last_login_ip`,
    MODIFY `email` VARCHAR(191) NULL;
