import Cloudflare from "cloudflare";

const cf = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_USER_API,
});

export async function createZone(domain: string) {
  const zone = await cf.zones.create({
    account: { id: process.env.CLOUDFLARE_USER_ID },
    name: domain,
    type: "full",
  });
  return zone;
}

export async function getNameServers(zoneID: string) {
  const zone = await cf.zones.get({ zone_id: zoneID });
  return zone.name_servers;
}

export async function deleteZone(zoneID: string) {
  try {
    await cf.zones.delete({ zone_id: zoneID });
  } catch {}
}
