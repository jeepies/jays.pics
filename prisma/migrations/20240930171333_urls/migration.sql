-- AlterTable
ALTER TABLE `UploaderPreferences` ADD COLUMN `urls` VARCHAR(191) NOT NULL DEFAULT '["jays.pics"]';

-- CreateTable
CREATE TABLE `URL` (
    `id` VARCHAR(191) NOT NULL,
    `donater_id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `public` BOOLEAN NOT NULL,
    `connected` BOOLEAN NOT NULL,

    UNIQUE INDEX `URL_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `URL` ADD CONSTRAINT `URL_donater_id_fkey` FOREIGN KEY (`donater_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
