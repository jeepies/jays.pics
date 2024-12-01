import { User } from "@prisma/client";
import { prisma } from "../prisma.server";

export async function GetUserByReferralCode(code: string) {
  return prisma.referralProfile.findFirst({
    include: {
      user: true,
    },
    where: {
      referral_code: code,
    },
  });
}

export async function CheckUsernameTaken(username: string): Promise<boolean> {
  const count = await prisma.user.count({ where: { username: username } });
  return count !== 0;
}

export async function GetUserByUsername(
  username: string,
): Promise<User | null> {
  return prisma.user.findFirst({
    where: {
      username: username,
    },
  });
}

export async function GetUserByID(id: string): Promise<User | null> {
  return prisma.user.findFirst({
    where: {
      id: id,
    },
  });
}
