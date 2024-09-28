/*
  Warnings:

  - You are about to drop the column `referral_code` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Referral` DROP FOREIGN KEY `Referral_referred_id_fkey`;

-- DropIndex
DROP INDEX `User_referral_code_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `referral_code`;

-- CreateTable
CREATE TABLE `ReferrerProfile` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `referral_code` VARCHAR(191) NOT NULL,
    `referral_limit` INTEGER NOT NULL DEFAULT 5,

    UNIQUE INDEX `ReferrerProfile_id_key`(`id`),
    UNIQUE INDEX `ReferrerProfile_userId_key`(`userId`),
    UNIQUE INDEX `ReferrerProfile_referral_code_key`(`referral_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ReferrerProfile` ADD CONSTRAINT `ReferrerProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Referral` ADD CONSTRAINT `Referral_referred_id_fkey` FOREIGN KEY (`referred_id`) REFERENCES `ReferrerProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
