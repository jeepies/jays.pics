import { PrismaClient, Progress, LogType } from "@prisma/client";
import { Cloudflare } from "cloudflare";

const prisma = new PrismaClient();
const cf = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_USER_API!,
});

interface Domain {
  id: string;
  url: string;
  zone_id: string;
  progress: Progress;
}

async function cleanDomains(): Promise<void> {
  let checked = 0;

  const domains = await prisma.uRL.findMany({
    where: {
      progress: { in: [Progress.WAITING, Progress.DONE] },
    },
  });

  for (const domain of domains) {
    checked += 1;

    try {
      const zone = await cf.zones.get({ zone_id: domain.zone_id });

      await prisma.uRL.update({
        where: { id: domain.id },
        data: { last_checked_at: new Date() },
      });

      if (!zone || zone.activated_on == null) {
        await removeDomain(domain, "inactive zone");
      }
    } catch (err) {
      await removeDomain(domain, `error: ${err}`);
    }
  }

  if (checked !== 0) {
    await prisma.log.create({
      data: {
        message: `Cleaned ${checked} domains`,
        type: LogType.DOMAIN_CHECK,
      },
    });
  }

  console.log(`Domain cleanup completed. Processed ${checked} domains.`);
}

async function removeDomain(domain: Domain, reason: string): Promise<void> {
  try {
    await prisma.uRL.delete({ where: { id: domain.id } });

    try {
      await cf.zones.delete({ zone_id: domain.zone_id });
    } catch (error) {
      console.error(`Failed to delete zone ${domain.zone_id}:`, error);
    }

    const prefs = await prisma.uploaderPreferences.findMany({
      where: { urls: { has: domain.url } },
      select: { userId: true, urls: true },
    });

    for (const pref of prefs) {
      await prisma.notification.create({
        data: {
          receiver_id: pref.userId,
          content: `Domain ${domain.url} was removed`,
        },
      });

      await prisma.uploaderPreferences.update({
        where: { userId: pref.userId },
        data: { urls: pref.urls.filter((u) => u !== domain.url) },
      });
    }

    await prisma.log.create({
      data: {
        message: `removed ${domain.url} (${domain.id}) due to ${reason}`,
        type: LogType.DOMAIN_CHECK,
      },
    });

    console.log(`Removed domain ${domain.url} due to ${reason}`);
  } catch (error) {
    console.error(`Error removing domain ${domain.url}:`, error);
  }
}

cleanDomains()
  .catch((error) => {
    console.error("Error running domain cleanup:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
