/*
  Warnings:

  - You are about to drop the column `connected` on the `URL` table. All the data in the column will be lost.
  - Added the required column `type` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('ERROR', 'DOMAIN_CHECK');

-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "type" "LogType" NOT NULL;

-- AlterTable
ALTER TABLE "URL" DROP COLUMN "connected";
