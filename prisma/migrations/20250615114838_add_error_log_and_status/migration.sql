-- CreateEnum
CREATE TYPE "ErrorStatus" AS ENUM ('OPEN', 'INVESTIGATING', 'RESOLVED', 'NOT_RELEVANT');

-- CreateTable
CREATE TABLE "SiteError" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "user_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "ErrorStatus" NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SiteError_id_key" ON "SiteError"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SiteError_code_key" ON "SiteError"("code");
