/*
  Warnings:

  - You are about to drop the column `donater_id` on the `URL` table. All the data in the column will be lost.
  - Added the required column `donator_id` to the `URL` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `URL` DROP FOREIGN KEY `URL_donater_id_fkey`;

-- AlterTable
ALTER TABLE `URL` DROP COLUMN `donater_id`,
    ADD COLUMN `donator_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `URL` ADD CONSTRAINT `URL_donator_id_fkey` FOREIGN KEY (`donator_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
