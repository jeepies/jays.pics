-- CreateTable
CREATE TABLE `Referrals` (
    `referrer_id` VARCHAR(191) NOT NULL,
    `referred_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Referrals_referred_id_key`(`referred_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Referrals` ADD CONSTRAINT `Referrals_referrer_id_fkey` FOREIGN KEY (`referrer_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
