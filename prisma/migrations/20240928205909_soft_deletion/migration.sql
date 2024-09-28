/*
  Warnings:

  - You are about to drop the column `deleted` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `ImageComment` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Comment` DROP COLUMN `deleted`,
    ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Image` DROP COLUMN `deleted`,
    ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `ImageComment` DROP COLUMN `deleted`,
    ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `deleted`,
    ADD COLUMN `deleted_at` DATETIME(3) NULL;
