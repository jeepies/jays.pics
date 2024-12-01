-- CreateTable
CREATE TABLE "Referrals" (
    "referrer_id" TEXT NOT NULL,
    "referred_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Referrals_referred_id_key" ON "Referrals"("referred_id");

-- AddForeignKey
ALTER TABLE "Referrals" ADD CONSTRAINT "referrer" FOREIGN KEY ("referred_id") REFERENCES "ReferralProfile"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referrals" ADD CONSTRAINT "Referrals_referred_id_fkey" FOREIGN KEY ("referred_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
