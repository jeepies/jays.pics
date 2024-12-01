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
    return count !== 0
}
