import { prisma } from "../prisma.server";

export async function GetReferralCountFromUserID(id: string) {
  return prisma.referrals.count({
    where: {
      referrer_id: id,
    },
  });
}

export async function IsUserAtReferralLimit(id: string): Promise<boolean> {
  const referralsCount = await GetReferralCountFromUserID(id);
  const limit = (
    await prisma.referralProfile.findFirst({
      where: {
        user_id: id,
      },
    })
  )?.referral_limit;
  return referralsCount === limit;
}

export async function CreateNewReferralM2M(referrer_id: string, referred_id: string) {
  return prisma.referrals.create({
    data: {
      referrer_id: referrer_id,
      referred_id: referred_id
    }
  })
}