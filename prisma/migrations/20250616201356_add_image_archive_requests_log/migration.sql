-- CreateTable
CREATE TABLE "ImageArchiveRequest" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "ImageArchiveRequest_id_key" ON "ImageArchiveRequest"("id");

-- CreateIndex
CREATE INDEX "ImageArchiveRequest_user_id_idx" ON "ImageArchiveRequest"("user_id");

-- AddForeignKey
ALTER TABLE "ImageArchiveRequest" ADD CONSTRAINT "ImageArchiveRequest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
