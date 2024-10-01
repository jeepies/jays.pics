-- CreateEnum
CREATE TYPE "Progress" AS ENUM ('INPUT', 'WAITING', 'DONE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "username_history" TEXT NOT NULL DEFAULT '[]',
    "username_changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "badges" TEXT NOT NULL DEFAULT '[{"name":"user","text":"User"}]',
    "upload_key" TEXT NOT NULL,
    "space_used" INTEGER NOT NULL DEFAULT 0,
    "max_space" INTEGER NOT NULL DEFAULT 200000000,
    "last_login_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "ReferrerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "referral_code" TEXT NOT NULL,
    "referral_limit" INTEGER NOT NULL DEFAULT 5
);

-- CreateTable
CREATE TABLE "UploaderPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "embed_title" TEXT NOT NULL DEFAULT '{{image.name}}',
    "embed_author" TEXT NOT NULL DEFAULT 'Uploaded by {{uploader.name}}',
    "embed_colour" TEXT NOT NULL DEFAULT '#252525',
    "urls" TEXT NOT NULL DEFAULT '["jays.pics"]'
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "commenter_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "hidden" BOOLEAN NOT NULL,
    "flagged" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "uploader_id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "ImageComment" (
    "id" TEXT NOT NULL,
    "image_id" TEXT NOT NULL,
    "commenter_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "hidden" BOOLEAN NOT NULL,
    "flagged" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "Referral" (
    "referrer_id" TEXT NOT NULL,
    "referred_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "URL" (
    "id" TEXT NOT NULL,
    "donator_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "public" BOOLEAN NOT NULL,
    "connected" BOOLEAN NOT NULL,
    "last_checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progress" "Progress" NOT NULL DEFAULT 'INPUT',
    "zone_id" TEXT NOT NULL DEFAULT ''
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_upload_key_key" ON "User"("upload_key");

-- CreateIndex
CREATE UNIQUE INDEX "ReferrerProfile_id_key" ON "ReferrerProfile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ReferrerProfile_userId_key" ON "ReferrerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ReferrerProfile_referral_code_key" ON "ReferrerProfile"("referral_code");

-- CreateIndex
CREATE UNIQUE INDEX "UploaderPreferences_id_key" ON "UploaderPreferences"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UploaderPreferences_userId_key" ON "UploaderPreferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_id_key" ON "Comment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Image_id_key" ON "Image"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ImageComment_id_key" ON "ImageComment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referred_id_key" ON "Referral"("referred_id");

-- CreateIndex
CREATE UNIQUE INDEX "Announcement_id_key" ON "Announcement"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Log_id_key" ON "Log"("id");

-- CreateIndex
CREATE UNIQUE INDEX "URL_id_key" ON "URL"("id");

-- CreateIndex
CREATE UNIQUE INDEX "URL_url_key" ON "URL"("url");

-- AddForeignKey
ALTER TABLE "ReferrerProfile" ADD CONSTRAINT "ReferrerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploaderPreferences" ADD CONSTRAINT "UploaderPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_commenter_id_fkey" FOREIGN KEY ("commenter_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageComment" ADD CONSTRAINT "ImageComment_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageComment" ADD CONSTRAINT "ImageComment_commenter_id_fkey" FOREIGN KEY ("commenter_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "referrer" FOREIGN KEY ("referred_id") REFERENCES "ReferrerProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referred_id_fkey" FOREIGN KEY ("referred_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "URL" ADD CONSTRAINT "URL_donator_id_fkey" FOREIGN KEY ("donator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
