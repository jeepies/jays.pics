import { PrismaClient, Progress, LogType } from "@prisma/client";
import { Cloudflare } from "cloudflare";

const prisma = new PrismaClient();
const cf = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_USER_API!,
});

async function checkNameservers(): Promise<void> {
  const date = new Date();
  date.setDate(date.getDate() - 2);

  let checked = 0;

  const input = await prisma.uRL.findMany({
    where: {
      progress: Progress.INPUT,
      created_at: {
        lte: date,
      },
    },
  });

  for (const domain of input) {
    checked += 1;
    await prisma.uRL.delete({
      where: {
        id: domain.id,
      },
    });
    try {
      await cf.zones.delete({ zone_id: domain.zone_id });
    } catch (error) {
      console.error(`Failed to delete zone ${domain.zone_id}:`, error);
    }
  }

  const waiting = await prisma.uRL.findMany({
    where: {
      progress: Progress.WAITING,
    },
  });

  for (const domain of waiting) {
    checked += 1;

    try {
      const donator = await prisma.user.findFirst({
        where: {
          id: domain.donator_id,
        },
      });

      const zone = await cf.zones.get({ zone_id: domain.zone_id });

      if (zone.activated_on != null) {
        try {
          await cf.dns.records.create({
            zone_id: domain.zone_id,
            content: process.env.BASE_IP!,
            name: "@",
            type: "A",
            proxied: true,
          });

          await cf.dns.records.create({
            zone_id: domain.zone_id,
            content: process.env.BASE_IP!,
            name: "*",
            type: "A",
            proxied: true,
          });

          await prisma.uRL.update({
            where: {
              id: domain.id,
            },
            data: {
              progress: Progress.DONE,
            },
          });

          await prisma.log.create({
            data: {
              message: `changed ${domain.url} (${domain.id}) to DONE`,
              type: LogType.DOMAIN_CHECK,
            },
          });

          if (process.env.DISCORD_WEBHOOK_URL && donator) {
            try {
              await fetch(process.env.DISCORD_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  embeds: [
                    {
                      title: "Domain added",
                      description: `✅ ${domain.url} was added by ${donator.username}`,
                    },
                  ],
                }),
              });
            } catch (error) {
              console.error("Failed to send Discord notification:", error);
            }
          }
        } catch (err) {
          await prisma.log.create({
            data: {
              message: `failed to create dns record: ${err}`,
              type: LogType.DOMAIN_CHECK,
            },
          });
        }
      }
    } catch (error) {
      console.error(`Error processing domain ${domain.url}:`, error);
    }
  }

  if (checked !== 0) {
    await prisma.log.create({
      data: {
        message: `Checked ${checked} domains`,
        type: LogType.DOMAIN_CHECK,
      },
    });
  }

  console.log(`Nameserver check completed. Processed ${checked} domains.`);
}

checkNameservers()
  .catch((error) => {
    console.error("Error running nameserver check:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
