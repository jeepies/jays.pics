/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `URL` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `URL` MODIFY `progress` ENUM('INPUT', 'NAMESERVERS', 'WAITING', 'DONE') NOT NULL DEFAULT 'INPUT';

-- CreateIndex
CREATE UNIQUE INDEX `URL_url_key` ON `URL`(`url`);
