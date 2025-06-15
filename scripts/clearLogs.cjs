const { PrismaClient, Progress, LogType } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.log.deleteMany({});
  console.log(`Deleted ${result.count} rows`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
