-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL,
    "is_upload_blocked" BOOLEAN NOT NULL DEFAULT true
);

-- CreateIndex
CREATE UNIQUE INDEX "Site_id_key" ON "Site"("id");
