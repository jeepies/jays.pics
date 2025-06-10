const { PrismaClient, Progress, LogType } = require("@prisma/client");
const { Cloudflare } = require("cloudflare");

const prisma = new PrismaClient();
const cf = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_USER_API,
});

module.exports = async () => {
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
      if (!zone || zone.status !== "active") {
        await prisma.uRL.delete({ where: { id: domain.id } });
        await cf.zones.delete({ zone_id: domain.zone_id }).catch(() => {});
        await prisma.log.create({
          data: {
            message: `removed ${domain.url} (${domain.id}) due to inactive zone`,
            type: LogType.DOMAIN_CHECK,
          },
        });
      }
    } catch (err) {
      await prisma.uRL.delete({ where: { id: domain.id } }).catch(() => {});
      await cf.zones.delete({ zone_id: domain.zone_id }).catch(() => {});
      await prisma.log.create({
        data: {
          message: `error checking ${domain.url}: ${err}`,
          type: LogType.DOMAIN_CHECK,
        },
      });
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
};