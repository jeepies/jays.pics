/*
  Warnings:

  - You are about to drop the column `embed_author` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `embed_colour` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `embed_title` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `referral_limit` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Referral` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_login_ip` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Referral` DROP FOREIGN KEY `Referral_referrer_id_fkey`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `embed_author`,
    DROP COLUMN `embed_colour`,
    DROP COLUMN `embed_title`,
    DROP COLUMN `isAdmin`,
    DROP COLUMN `referral_limit`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `last_login_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `last_login_ip` VARCHAR(191) NOT NULL,
    MODIFY `badges` VARCHAR(191) NOT NULL DEFAULT '[{"name":"user","text":"User"}]';

-- DropTable
DROP TABLE `Referral`;

-- CreateTable
CREATE TABLE `UploaderPreferences` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `embed_title` VARCHAR(191) NOT NULL DEFAULT 'Uploaded by {{uploader.name}}',
    `embed_author` VARCHAR(191) NOT NULL DEFAULT '{{image.upload_date}}',
    `embed_colour` VARCHAR(191) NOT NULL DEFAULT '#252525',

    UNIQUE INDEX `UploaderPreferences_id_key`(`id`),
    UNIQUE INDEX `UploaderPreferences_userId_key`(`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);

-- AddForeignKey
ALTER TABLE `UploaderPreferences` ADD CONSTRAINT `UploaderPreferences_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
