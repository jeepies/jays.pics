const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async () => {
  const now = new Date();
  const startOfDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
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

  if (process.env.DISCORD_WEBHOOK_URL) {
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
    }).catch(() => {});
  }
};
