-- AlterTable
ALTER TABLE `UploaderPreferences` MODIFY `embed_title` VARCHAR(191) NOT NULL DEFAULT '{{image.name}}',
    MODIFY `embed_author` VARCHAR(191) NOT NULL DEFAULT 'Uploaded by {{uploader.name}}';

-- AlterTable
ALTER TABLE `User` ADD COLUMN `email_changed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `password_changed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `username_changed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `username_history` VARCHAR(191) NOT NULL DEFAULT '[]';
