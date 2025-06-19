-- CreateTable
CREATE TABLE "StorageSubscription" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "stripe_subscription_id" TEXT NOT NULL,
    "storage" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelled_at" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "StorageSubscription_id_key" ON "StorageSubscription"("id");

-- CreateIndex
CREATE UNIQUE INDEX "StorageSubscription_stripe_subscription_id_key" ON "StorageSubscription"("stripe_subscription_id");

-- CreateIndex
CREATE INDEX "StorageSubscription_user_id_idx" ON "StorageSubscription"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_id_key" ON "Verification"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_user_id_code_key" ON "Verification"("user_id", "code");

-- AddForeignKey
ALTER TABLE "StorageSubscription" ADD CONSTRAINT "StorageSubscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
