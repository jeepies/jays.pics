/*
  Warnings:

  - You are about to drop the column `email_changed_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password_changed_at` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `email_changed_at`,
    DROP COLUMN `password_changed_at`;
