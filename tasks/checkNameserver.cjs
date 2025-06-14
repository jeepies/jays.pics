const { PrismaClient, Progress, LogType } = require('@prisma/client');
const { Cloudflare } = require('cloudflare');

const prisma = new PrismaClient();
const cf = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_USER_API,
});

module.exports = async (payload, helpers) => {
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

  input.forEach(async (domain) => {
    checked += 1;
    await prisma.uRL.delete({
      where: {
        id: domain.id,
      },
    });
    cf.zones.delete({ zone_id: domain.zone_id });
  });

  const waiting = await prisma.uRL.findMany({
    where: {
      progress: Progress.WAITING,
    },
  });

  const threshold = new Date();
  threshold.setDate(threshold.getDate() - 2);

  for (const domain of waiting) {
    checked += 1;
    const donator = await prisma.user.findFirst({
      where: {
        id: domain.donator_id,
      },
    });

    await prisma.uRL.update({
      where: { id: domain.id },
      data: { last_checked_at: new Date() },
    });

    const zone = await cf.zones.get({ zone_id: domain.zone_id });
    if (zone.activated_on != null) {
      try {
        cf.dns.records.create({
          zone_id: domain.zone_id,
          content: process.env.BASE_IP,
          name: '@',
          type: 'A',
          proxied: true,
        });

        await cf.dns.records.create({
          zone_id: domain.zone_id,
          content: process.env.BASE_IP,
          name: '*',
          type: 'A',
          proxied: true,
        });
        await prisma.uRL.update({
          where: { id: domain.id },
          data: { progress: Progress.DONE },
        });
        await prisma.log.create({
          data: {
            message: `changed ${domain.url} (${domain.id}) to DONE`,
            type: LogType.DOMAIN_CHECK,
          },
        });
        if (process.env.DISCORD_WEBHOOK_URL) {
          fetch(process.env.DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              embeds: [
                {
                  title: 'Domain added',
                  description: `✅ ${domain.url} was added by ${donator.username}`,
                },
              ],
            }),
          }).catch(() => {});
        }
      } catch (err) {
        await prisma.log.create({
          data: {
            message: `failed to create dns record: ${err}`,
            type: LogType.DOMAIN_CHECK,
          },
        });
      }
    } else if (domain.created_at <= threshold) {
      await prisma.uRL.delete({ where: { id: domain.id } }).catch(() => {});
      await cf.zones.delete({ zone_id: domain.zone_id }).catch(() => {});

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
          message: `removed ${domain.url} (${domain.id}) due to inactive zone`,
          type: LogType.DOMAIN_CHECK,
        },
      });
    }

    if (checked !== 0) {
      await prisma.log.create({
        data: {
          message: `Checked ${checked} domains`,

          type: LogType.DOMAIN_CHECK,
        },
      });
    }
  }
};
