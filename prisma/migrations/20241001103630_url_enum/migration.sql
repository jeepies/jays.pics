/*
  Warnings:

  - You are about to alter the column `progress` on the `URL` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `URL` MODIFY `progress` ENUM('NAMESERVERS', 'WAITING', 'DONE') NOT NULL DEFAULT 'NAMESERVERS';
