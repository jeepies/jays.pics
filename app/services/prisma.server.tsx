import { PrismaClient } from "@prisma/client";

const _prisma = new PrismaClient().$extends({});

type prismaType = typeof _prisma;

if (!global.__prisma) {
    global.__prisma = _prisma;
  }
  
  declare global {
    var __prisma: prismaType;
  }
  
  global.__prisma.$connect();
  export const prisma = global.__prisma;