-- CreateTable
CREATE TABLE "StorageSubscription" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "stripe_subscription_id" TEXT NOT NULL,
    "storage" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelled_at" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "StorageSubscription_id_key" ON "StorageSubscription"("id");

-- CreateIndex
CREATE UNIQUE INDEX "StorageSubscription_stripe_subscription_id_key" ON "StorageSubscription"("stripe_subscription_id");

-- CreateIndex
CREATE INDEX "StorageSubscription_user_id_idx" ON "StorageSubscription"("user_id");

-- AddForeignKey
ALTER TABLE "StorageSubscription" ADD CONSTRAINT "StorageSubscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
