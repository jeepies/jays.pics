-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_tag_id_fkey";

-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "tag_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
