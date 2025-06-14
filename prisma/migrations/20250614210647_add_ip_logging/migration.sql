-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "uploader_ip" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "last_login_ip" TEXT;
