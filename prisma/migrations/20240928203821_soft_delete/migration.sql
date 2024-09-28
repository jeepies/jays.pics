-- AlterTable
ALTER TABLE `Comment` ADD COLUMN `deleted` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Image` ADD COLUMN `deleted` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `ImageComment` ADD COLUMN `deleted` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `deleted` DATETIME(3) NULL;
