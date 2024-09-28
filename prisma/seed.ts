import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      username: "System",
      password: "",
      badges: JSON.stringify([{ name: "sys", text: "SYSTEM" }]),
      is_admin: true,
      referrer_profile: {
        create: {}
      }
    },
  });
  await prisma.announcement.create({
    data: {
      content: "Welcome to jays.pics :)"
    }
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
