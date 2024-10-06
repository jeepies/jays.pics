-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "seen" SET DEFAULT false;

-- AlterTable
ALTER TABLE "URL" ADD COLUMN     "nameservers" TEXT[] DEFAULT ARRAY['', '']::TEXT[];

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "max_space" SET DEFAULT 100000000;
