const { PrismaClient, Progress } = require("@prisma/client");
const { Cloudflare } = require("cloudflare");

const prisma = new PrismaClient();
const cf = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_USER_API,
});

module.exports = async (payload, helpers) => {
  const waiting = await prisma.uRL.findMany({
    where: {
      progress: Progress.WAITING,
    },
  });

  waiting.forEach(async (domain) => {
    const zone = await cf.zones.get({ zone_id: domain.zone_id });
    if (zone.activated_on != null) {
      cf.dns.records.create({
        zone_id: domain.zone_id,
        content: "jays.pics",
        name: "@",
        type: "CNAME",
        proxied: true,
      }).then(async () => {
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
            message: `changed ${domain.url} (${domain.id}) to DONE`
          }
        })
      }).catch(async (err) => {
        await prisma.log.create({
          data: {
            message: `failed to create dns record: ${err}`
          }
        })
      });
    }
  });
};
