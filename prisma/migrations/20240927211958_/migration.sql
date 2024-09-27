-- AlterTable
ALTER TABLE `User` ADD COLUMN `embed_author` VARCHAR(191) NOT NULL DEFAULT '{{image.upload_date}}',
    ADD COLUMN `embed_colour` VARCHAR(191) NOT NULL DEFAULT '#252525',
    ADD COLUMN `embed_title` VARCHAR(191) NOT NULL DEFAULT 'Uploaded by {{uploader.name}}';
