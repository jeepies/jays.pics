import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function generateDailyStats(): Promise<void> {
  console.log(
    `[Task] Running generateDailyStats at ${new Date().toISOString()}`
  );

  try {
    const now = new Date();
    const startOfDay = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );

    const imageCount = await prisma.image.count({
      where: {
        deleted_at: null,
        created_at: { gte: startOfDay },
      },
    });

    const userCount = await prisma.user.count({
      where: {
        deleted_at: null,
        created_at: { gte: startOfDay },
      },
    });

    console.log(
      `[Task] Daily stats: ${imageCount} images uploaded, ${userCount} new users`
    );

    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            embeds: [
              {
                title: "Daily Stats",
                description: `📊 ${imageCount} images uploaded, ${userCount} new users`,
              },
            ],
          }),
        });
        console.log(`[Task] Discord notification sent successfully`);
      } catch (error) {
        console.error(`[Task] Failed to send Discord notification:`, error);
      }
    } else {
      console.log(
        `[Task] Discord webhook URL not configured, skipping notification`
      );
    }
  } catch (error) {
    console.error(`[Task] Error generating daily stats:`, error);
    throw error;
  }
}

generateDailyStats()
  .catch((error) => {
    console.error("Error running daily stats:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
