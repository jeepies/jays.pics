import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanExpiredVerifications(): Promise<void> {
  console.log(
    `[Task] Running cleanExpiredVerifications at ${new Date().toISOString()}`
  );

  try {
    const now = new Date();
    const result = await prisma.verification.deleteMany({
      where: {
        expires_at: {
          lt: now,
        },
      },
    });

    console.log(`[Task] Deleted ${result.count} expired verification records.`);
  } catch (error) {
    console.error(`[Task] Error cleaning expired verifications:`, error);
    throw error;
  }
}

cleanExpiredVerifications()
  .catch((error) => {
    console.error("Error running verification cleanup:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
