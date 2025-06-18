import { Resend } from "resend";

import VerificationEmail from "~/emails/verification";

import { prisma } from "./database.server";
import { checkRateLimit, emailVerificationRateLimit } from "./redis.server";

const resend = new Resend(process.env.RESEND_API_KEY);

export default resend;

export async function sendVerificationEmail(email: string, code: string) {
  const baseDomain = process.env.BASE_DOMAIN ?? "jays.pics";

  const rateLimitResult = await checkRateLimit(
    emailVerificationRateLimit,
    email,
  );

  const exists = await prisma.verification.findFirst({
    where: {
      user: {
        email,
      },
    },
  });

  if (!rateLimitResult.success || exists) {
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return;
  }

  const verification = await prisma.verification.create({
    data: {
      user_id: user.id,
      code,
      expires_at: new Date(Date.now() + 1 * 60 * 60 * 1000),
    },
  });

  if (!verification) {
    return;
  }

  const { data, error } = await resend.emails.send({
    from: `jays.pics <noreply@${baseDomain}>`,
    replyTo: `jays.pics <noreply@${baseDomain}>`,
    to: email,
    subject: "Verify your email",
    react: VerificationEmail({ verificationCode: code }),
  });

  if (error) {
    console.error(error);
  }

  return data;
}
