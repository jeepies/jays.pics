-- CreateEnum
CREATE TYPE "ImageReportReason" AS ENUM ('SPAM', 'COPYRIGHT', 'INAPPROPRIATE', 'OTHER');

-- CreateTable
CREATE TABLE "ImageReport" (
    "id" TEXT NOT NULL,
    "image_id" TEXT NOT NULL,
    "reporter_id" TEXT NOT NULL,
    "reason_type" "ImageReportReason" NOT NULL,
    "detail" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "ImageReport_id_key" ON "ImageReport"("id");

-- AddForeignKey
ALTER TABLE "ImageReport" ADD CONSTRAINT "ImageReport_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageReport" ADD CONSTRAINT "ImageReport_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
