/*
  Warnings:

  - You are about to drop the `Comments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Comments` DROP FOREIGN KEY `Comments_commenter_id_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `badges` VARCHAR(191) NOT NULL DEFAULT 'user';

-- DropTable
DROP TABLE `Comments`;

-- CreateTable
CREATE TABLE `Comment` (
    `id` VARCHAR(191) NOT NULL,
    `commenter_id` VARCHAR(191) NOT NULL,
    `receiver_id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `hidden` BOOLEAN NOT NULL,
    `flagged` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Comment_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_commenter_id_fkey` FOREIGN KEY (`commenter_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
