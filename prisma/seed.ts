import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

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
