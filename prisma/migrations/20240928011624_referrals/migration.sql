-- CreateTable
CREATE TABLE `Referral` (
    `referrer_id` VARCHAR(191) NOT NULL,
    `referred_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Referral_referred_id_key`(`referred_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Referral` ADD CONSTRAINT `Referral_referred_id_fkey` FOREIGN KEY (`referred_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
