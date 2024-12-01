-- CreateTable
CREATE TABLE "ReferralProfile" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "referral_code" TEXT NOT NULL,
    "referral_limit" INTEGER NOT NULL DEFAULT 5
);

-- CreateIndex
CREATE UNIQUE INDEX "ReferralProfile_id_key" ON "ReferralProfile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralProfile_user_id_key" ON "ReferralProfile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralProfile_referral_code_key" ON "ReferralProfile"("referral_code");

-- AddForeignKey
ALTER TABLE "ReferralProfile" ADD CONSTRAINT "ReferralProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
