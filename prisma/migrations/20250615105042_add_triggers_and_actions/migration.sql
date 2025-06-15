-- CreateTable
CREATE TABLE "Trigger" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TriggerAction" (
    "id" TEXT NOT NULL,
    "trigger_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Trigger_id_key" ON "Trigger"("id");

-- CreateIndex
CREATE INDEX "Trigger_user_id_idx" ON "Trigger"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "TriggerAction_id_key" ON "TriggerAction"("id");

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TriggerAction" ADD CONSTRAINT "TriggerAction_trigger_id_fkey" FOREIGN KEY ("trigger_id") REFERENCES "Trigger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
