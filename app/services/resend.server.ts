import { json } from "@remix-run/node";
import { Resend } from "resend";

import ResetPasswordEmail from "~/emails/reset-password";
import VerificationEmail from "~/emails/verification";
import { CodeCharacterType, generateCode } from "~/lib/code";

import { prisma } from "./database.server";
import { checkRateLimit, emailVerificationRateLimit } from "./redis.server";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  applyRateLimit: boolean = true,
) {
  const baseDomain = process.env.BASE_DOMAIN ?? "jays.pics";

  if (applyRateLimit) {
    const rateLimitResult = await checkRateLimit(
      emailVerificationRateLimit,
      email,
    );

    if (!rateLimitResult.success) {
      return;
    }
  }

  const code = generateCode({
    codeLength: 6,
    characterType: CodeCharacterType.NUMERIC,
  });

  await prisma.verification.deleteMany({
    where: {
      user: {
        email: email,
      },
      expires_at: {
        lt: new Date(),
      },
    },
  });

  await prisma.verification.create({
    data: {
      user: {
        connect: {
          email: email,
        },
      },
      code: code,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  });

  const { data, error } = await resend.emails.send({
    from: `jays.pics <noreply@${baseDomain}>`,
    replyTo: `jays.pics <noreply@${baseDomain}>`,
    to: email,
    subject: "Verify your email",
    react: VerificationEmail({
      verificationCode: code,
    }),
  });

  if (error) {
    console.error("Error sending verification email", error);
    return json(
      { error: "Failed to send verification email, please try again." },
      400,
    );
  }

  return data;
}

export async function sendResetPasswordEmail(
  email: string,
  applyRateLimit: boolean = true,
) {
  const baseDomain = process.env.BASE_DOMAIN ?? "jays.pics";

  if (applyRateLimit) {
    const rateLimitResult = await checkRateLimit(
      emailVerificationRateLimit,
      email,
    );

    if (!rateLimitResult.success) {
      return;
    }
  }

  const code = generateCode({
    codeLength: 32,
    characterType: CodeCharacterType.ALPHANUMERIC_MIXED,
    prefix: "jp-",
    suffix: "-pr",
  });

  // Clean up any existing expired reset password codes for this user
  await prisma.verification.deleteMany({
    where: {
      user: {
        email: email,
      },
      expires_at: {
        lt: new Date(),
      },
    },
  });

  // Create the new verification code
  await prisma.verification.create({
    data: {
      user: {
        connect: {
          email: email,
        },
      },
      code: code,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  });

  const { data, error } = await resend.emails.send({
    from: `jays.pics <noreply@${baseDomain}>`,
    replyTo: `jays.pics <noreply@${baseDomain}>`,
    to: email,
    subject: "Reset your password",
    react: ResetPasswordEmail({
      code: code,
      userEmail: email,
    }),
  });

  if (error) {
    console.error("Error sending reset password email", error);
    return json(
      { error: "Failed to send reset password email, please try again." },
      400,
    );
  }

  return data;
}
