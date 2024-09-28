-- DropForeignKey
ALTER TABLE `Referral` DROP FOREIGN KEY `Referral_referred_id_fkey`;

-- AddForeignKey
ALTER TABLE `Referral` ADD CONSTRAINT `referrer` FOREIGN KEY (`referred_id`) REFERENCES `ReferrerProfile`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Referral` ADD CONSTRAINT `Referral_referred_id_fkey` FOREIGN KEY (`referred_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
