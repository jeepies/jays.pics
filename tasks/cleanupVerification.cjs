import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const cleanVerification = async () => {
  const verifications = await prisma.verification.findMany({
    where: {
      expires_at: { lt: new Date() },
    },
  });

  for (const verification of verifications) {
    await prisma.verification.delete({
      where: { id: verification.id },
    });
  }
  console.log(`Deleted ${verifications.length} verifications`);
};

cleanVerification()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
