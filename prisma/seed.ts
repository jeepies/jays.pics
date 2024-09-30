import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const system = await prisma.user.create({
    data: {
      username: "System",
      password: "",
      badges: JSON.stringify([{ name: "sys", text: "SYSTEM" }]),
      is_admin: true,
      referrer_profile: {
        create: {},
      },
    },
  });
  await prisma.announcement.create({
    data: {
      content: "Welcome to jays.pics :)",
    },
  });
  await prisma.uRL.createMany({
    data: [
      {
        donator_id: system.id,
        url: "jays.pics",
        public: true,
        connected: true
      },
      {
        donator_id: system.id,
        url: "femboys.wiki",
        public: true,
        connected: true
      },
      {
        donator_id: system.id,
        url: "i-dont.top",
        public: true,
        connected: true
      },
    ]
  })
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
