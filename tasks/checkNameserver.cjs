const { PrismaClient, Progress } = require("@prisma/client");
const { Cloudflare } = require("cloudflare");

const prisma = new PrismaClient();
const cf = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_USER_API,
});

module.exports = async (payload, helpers) => {
  const date = new Date();

  date.setDate(date.getDate() - 2);

  const checked = 0;

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

  waiting.forEach(async (domain) => {
    checked += 1;
    const zone = await cf.zones.get({ zone_id: domain.zone_id });
    if (zone.activated_on != null) {
      cf.dns.records
        .create({
          zone_id: domain.zone_id,
          content: process.env.BASE_IP,
          name: "@",
          type: "A",
          proxied: true,
        })
        .then(async () => {
          await cf.dns.records.create({
            zone_id: domain.zone_id,
            content: process.env.BASE_IP,
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
            },
          });
        })
        .catch(async (err) => {
          await prisma.log.create({
            data: {
              message: `failed to create dns record: ${err}`,
            },
          });
        });
    }
  });

  if(checked !== 0) {
    await prisma.log.create({
      data: {
        message: `Checked ${checked} domains`,
      },
    });
  }
};
