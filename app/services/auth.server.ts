import bcrypt from "bcryptjs";
import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { z } from "zod";

import { getIP } from "~/lib/ip";
import { applyRateLimit, isRateLimitResponse } from "~/lib/rate-limit";

import { prisma } from "./database.server";
import {
  emailVerificationRateLimit,
  loginRateLimit,
  registrationRateLimit,
  verificationCodeRateLimit,
} from "./redis.server";
import {
  sendChangeEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
} from "./resend.server";
import { getUserBySession, sessionStorage } from "./session.server";

export class FormError extends AuthorizationError {
  constructor(
    message: string,
    public data: {
      payload: Record<string, string>;
      formErrors: string[];
      fieldErrors: Record<string, string | undefined>;
    },
  ) {
    super(message);
  }
}

export const authenticator = new Authenticator<string>(sessionStorage, {
  sessionKey: "userID",
  throwOnError: true,
});

export async function redirectIfUser(request: Request) {
  return authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard/index",
  });
}

const loginSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(3, "Must be 3 or more characters"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Must be 8 or more characters")
    .max(256, "Must be 256 or less characters"),
});

authenticator.use(
  new FormStrategy(async ({ form, request }) => {
    const rateLimitResult = await applyRateLimit(
      request,
      loginRateLimit,
      getIP(request),
    );

    if (isRateLimitResponse(rateLimitResult)) {
      throw new FormError("Rate limit exceeded", {
        payload: {},
        formErrors: [],
        fieldErrors: {
          form: `Too many requests. You can try again at ${rateLimitResult}`,
        },
      });
    }

    const payload = Object.fromEntries(form) as Record<string, string>;
    const result = loginSchema.safeParse(payload);

    if (!result.success) {
      const error = result.error.flatten();
      throw new FormError("Validation", {
        payload,
        formErrors: error.formErrors,
        fieldErrors: error.fieldErrors as Record<string, string | undefined>,
      });
    }

    if (result.data.username === "system") {
      throw new FormError("Invalid", {
        payload,
        formErrors: [],
        fieldErrors: { username: "Invalid account", password: "" },
      });
    }

    const user = await prisma.user.findFirst({
      where: { username: result.data.username },
    });

    if (user === null) {
      throw new FormError("Missing", {
        payload,
        formErrors: [],
        fieldErrors: {
          username: "This username does not exist",
          password: "",
        },
      });
    }

    if (!(await bcrypt.compare(result.data.password, user.password))) {
      throw new FormError("Incorrect", {
        payload,
        formErrors: [],
        fieldErrors: { username: "", password: "Incorrect password" },
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        last_login_at: new Date(),
      },
    });

    return user.id;
  }),
  "login",
);

const registerSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .regex(/^[a-z0-9_]+$/gim, "Invalid username")
    .min(3, { message: "Must be 3 or more characters" })
    .max(20, { message: "Must be 20 or less characters" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Must be 8 or more characters" })
    .max(256, { message: "Must be 256 or less characters" })
    .regex(
      /([!?&_-]+)/g,
      "Insecure password - Please add one (or more) of (!, ?, &, - or _)",
    )
    .regex(
      /(\d+)/g,
      "Insecure password - Please add one (or more) digit (0-9)",
    ),
  email: z.string().email({ message: "Invalid email address" }),
  referralCode: z
    .string({ required_error: "Referral Code is required" })
    .uuid("Must be a valid referral code"),
});

authenticator.use(
  new FormStrategy(async ({ form, request }) => {
    const rateLimitResult = await applyRateLimit(
      request,
      registrationRateLimit,
      getIP(request),
    );

    if (isRateLimitResponse(rateLimitResult)) {
      throw new FormError("Rate limit exceeded", {
        payload: {},
        formErrors: [],
        fieldErrors: {
          form: `Too many requests. You can try again at ${rateLimitResult}`,
        },
      });
    }

    const payload = Object.fromEntries(form) as Record<string, string>;
    const result = registerSchema.safeParse(payload);

    if (!result.success) {
      const error = result.error.flatten();
      throw new FormError("Validation", {
        payload,
        formErrors: error.formErrors,
        fieldErrors: error.fieldErrors as Record<string, string | undefined>,
      });
    }

    if (
      await prisma.user.findFirst({ where: { username: result.data.username } })
    ) {
      throw new FormError("Exists", {
        payload,
        formErrors: [],
        fieldErrors: {
          username: "This username already exists",
        },
      });
    }

    if (
      await prisma.user.findFirst({
        where: { email: result.data.email.toLowerCase() },
      })
    ) {
      throw new FormError("Exists", {
        payload,
        formErrors: [],
        fieldErrors: { email: "This email is already in use" },
      });
    }

    const referrer = await prisma.referrerProfile.findFirst({
      where: { referral_code: result.data.referralCode },
    });

    if (referrer === null) {
      throw new FormError("Invalid", {
        payload,
        formErrors: [],
        fieldErrors: {
          referralCode: "This referral code is invalid",
        },
      });
    }

    const referralsAlreadyUsed = (
      await prisma.referral.findMany({ where: { referrer_id: referrer.id } })
    ).length;

    if (referralsAlreadyUsed === referrer.referral_limit) {
      throw new FormError("Limit", {
        payload,
        formErrors: [],
        fieldErrors: {
          referralCode: "This referral code has been used too many times",
        },
      });
    }

    const hashedPassword = bcrypt.hashSync(result.data.password, 10);

    const count = await prisma.user.count();

    let badges: string | undefined;
    if (count < 100) {
      badges = JSON.stringify([
        { name: "user", text: "User" },
        { name: "early", text: "Early" },
      ]);
    }

    const emailExists = await prisma.user.findFirst({
      where: { email: result.data.email.toLowerCase() },
    });

    if (emailExists) {
      throw new FormError("Exists", {
        payload,
        formErrors: [],
        fieldErrors: { email: "This email is already in use" },
      });
    }

    const user = await prisma.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        email_verified: false,
        password: hashedPassword,
        referrer_profile: {
          create: {},
        },
        upload_preferences: {
          create: {
            subdomains: {},
          },
        },
        last_login_at: new Date(),
        badges,
      },
    });

    await sendVerificationEmail(result.data.email, false);

    if (process.env.DISCORD_WEBHOOK_URL) {
      fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [
            {
              title: "New user joined",
              description: `🎉 ${user.username} just signed up`,
            },
          ],
        }),
      }).catch(() => {});
    }

    await prisma.referral.create({
      data: {
        referred_id: user.id,
        referrer_id: referrer.id,
      },
    });

    return user.id;
  }),
  "register",
);

const verifySchema = z.object({
  code: z
    .string({ required_error: "Verification code is required" })
    .length(6, "Verification code must be exactly 6 digits")
    .regex(/^\d{6}$/, "Verification code must contain only numbers"),
});

authenticator.use(
  new FormStrategy(async ({ form, request }) => {
    const payload = Object.fromEntries(form) as Record<string, string>;
    const result = verifySchema.safeParse(payload);

    if (!result.success) {
      const error = result.error.flatten();
      throw new FormError("Validation", {
        payload,
        formErrors: error.formErrors,
        fieldErrors: error.fieldErrors as Record<string, string | undefined>,
      });
    }

    const session = await sessionStorage.getSession(
      request.headers.get("Cookie"),
    );

    if (!session.has("userID")) {
      throw new FormError("Unauthorized", {
        payload: {},
        formErrors: [],
        fieldErrors: {
          form: "You must be logged in to resend verification",
        },
      });
    }

    const user = await getUserBySession(session);

    if (!user || !user.email) {
      throw new FormError("User not found", {
        payload: {},
        formErrors: [],
        fieldErrors: { form: "User not found. Please log in again." },
      });
    }

    const verification = await prisma.verification.findFirst({
      where: {
        code: result.data.code,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            email_verified: true,
          },
        },
      },
    });

    if (!verification) {
      throw new FormError("Invalid", {
        payload,
        formErrors: [],
        fieldErrors: { code: "Invalid verification code" },
      });
    }

    if (verification.expires_at < new Date()) {
      await prisma.verification.delete({
        where: { id: verification.id },
      });

      throw new FormError("Expired", {
        payload,
        formErrors: [],
        fieldErrors: {
          code: "Verification code has expired. Please request a new one.",
        },
      });
    }

    if (user.email_verified) {
      await prisma.verification.delete({
        where: { id: verification.id },
      });

      throw new FormError("Already verified", {
        payload,
        formErrors: [],
        fieldErrors: { code: "Email is already verified" },
      });
    }

    const rateLimitResult = await applyRateLimit(
      request,
      verificationCodeRateLimit,
      user.id.toString(),
    );

    if (isRateLimitResponse(rateLimitResult)) {
      throw new FormError("Rate limit exceeded", {
        payload: {},
        formErrors: [],
        fieldErrors: {
          form: `Too many verification attempts. You can try again at ${rateLimitResult}`,
        },
      });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { email_verified: true, last_login_at: new Date() },
      }),
      prisma.verification.delete({
        where: { id: verification.id },
      }),
    ]);

    return user.id;
  }),
  "verify",
);

authenticator.use(
  new FormStrategy(async ({ request }) => {
    const session = await sessionStorage.getSession(
      request.headers.get("Cookie"),
    );

    if (!session.has("userID")) {
      throw new FormError("Unauthorized", {
        payload: {},
        formErrors: [],
        fieldErrors: {
          form: "You must be logged in to resend verification",
        },
      });
    }

    const user = await getUserBySession(session);

    if (!user) {
      throw new FormError("User not found", {
        payload: {},
        formErrors: [],
        fieldErrors: {
          form: "User not found. Please log in again.",
        },
      });
    }

    if (!user.email) {
      throw new FormError("No email", {
        payload: {},
        formErrors: [],
        fieldErrors: {
          form: "No email address associated with this account",
        },
      });
    }

    if (user.email_verified) {
      throw new FormError("Already verified", {
        payload: {},
        formErrors: [],
        fieldErrors: {
          form: "Email is already verified",
        },
      });
    }

    const rateLimitResult = await applyRateLimit(
      request,
      emailVerificationRateLimit,
      user.id.toString(),
    );

    if (isRateLimitResponse(rateLimitResult)) {
      throw new FormError("Rate limit exceeded", {
        payload: {},
        formErrors: [],
        fieldErrors: {
          form: `Too many resend requests. You can try again at ${rateLimitResult}`,
        },
      });
    }

    const existingVerifications = await prisma.verification.findMany({
      where: { user_id: user.id },
    });

    for (const verification of existingVerifications) {
      if (verification.expires_at < new Date()) {
        await prisma.verification.delete({
          where: { id: verification.id },
        });
      }
      if (verification.code.length === 6) {
        await prisma.verification.delete({
          where: { id: verification.id },
        });
      }
    }

    try {
      await sendVerificationEmail(user.email.toLowerCase(), false);
    } catch (error) {
      console.error("Failed to send verification email:", error);
      throw new FormError("Send failed", {
        payload: {},
        formErrors: [],
        fieldErrors: {
          form: "Failed to send verification email. Please try again. If the problem persists, please contact support.",
        },
      });
    }

    return user.id;
  }),
  "resend",
);

const forgotSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const payload = Object.fromEntries(form) as Record<string, string>;
    const result = forgotSchema.safeParse(payload);

    if (!result.success) {
      const error = result.error.flatten();
      throw new FormError("Validation", {
        payload,
        formErrors: error.formErrors,
        fieldErrors: error.fieldErrors as Record<string, string | undefined>,
      });
    }

    const user = await prisma.user.findFirst({
      where: { email: result.data.email.toLowerCase() },
    });

    if (!user) {
      throw new FormError("Invalid", {
        payload,
        formErrors: [],
        fieldErrors: { email: "No account found with this email address" },
      });
    }

    await sendResetPasswordEmail(result.data.email, false);

    return user.id;
  }),
  "forgot-password",
);

const resetPasswordSchema = z.object({
  token: z
    .string({ required_error: "Reset password token is required" })
    .min(36, "Reset password token must be 36 characters")
    .refine((token) => token.startsWith("jp-"), {
      message: "Invalid reset password token",
    })
    .refine((token) => token.endsWith("-pr"), {
      message: "Invalid reset password token",
    }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(256, "Password must be 256 or less characters"),
  confirmPassword: z
    .string({ required_error: "Confirm password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(256, "Password must be 256 or less characters"),
});

authenticator.use(
  new FormStrategy(async ({ form, request }) => {
    const payload = Object.fromEntries(form) as Record<string, string>;
    const result = resetPasswordSchema.safeParse(payload);

    if (!result.success) {
      const error = result.error.flatten();
      throw new FormError("Validation", {
        payload,
        formErrors: error.formErrors,
        fieldErrors: error.fieldErrors as Record<string, string | undefined>,
      });
    }

    const verification = await prisma.verification.findFirst({
      where: {
        code: result.data.token,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!verification) {
      throw new FormError("Invalid", {
        payload,
        formErrors: [],
        fieldErrors: { code: "Invalid reset password code" },
      });
    }

    if (verification.expires_at < new Date()) {
      await prisma.verification.delete({
        where: { id: verification.id },
      });

      throw new FormError("Expired", {
        payload,
        formErrors: [],
        fieldErrors: {
          code: "Reset password code has expired. Please request a new one.",
        },
      });
    }

    const user = verification.user;

    if (!user.email) {
      throw new FormError("Invalid", {
        payload,
        formErrors: [],
        fieldErrors: { code: "Invalid reset password code" },
      });
    }

    if (result.data.password !== result.data.confirmPassword) {
      throw new FormError("Invalid", {
        payload,
        formErrors: [],
        fieldErrors: { code: "Passwords do not match" },
      });
    }

    const hashedPassword = bcrypt.hashSync(result.data.password, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      prisma.verification.delete({
        where: { id: verification.id },
      }),
    ]);

    return user.id;
  }),
  "reset-password",
);

const verifyChangeEmailSchema = z.object({
  code: z
    .string({ required_error: "Verification code is required" })
    .length(36, "Verification code must be exactly 36 characters")
    .regex(/^jp-/, "Verification code must start with jp-")
    .regex(/-ce$/, "Verification code must end with -ce"),
});

authenticator.use(
  new FormStrategy(async ({ form, request }) => {
    const payload = Object.fromEntries(form) as Record<string, string>;
    const result = verifyChangeEmailSchema.safeParse(payload);

    if (!result.success) {
      const error = result.error.flatten();
      throw new FormError("Validation", {
        payload,
        formErrors: error.formErrors,
        fieldErrors: error.fieldErrors as Record<string, string | undefined>,
      });
    }

    const verification = await prisma.verification.findFirst({
      where: {
        code: result.data.code,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            email_verified: true,
          },
        },
      },
    });

    if (!verification) {
      throw new FormError("Invalid", {
        payload,
        formErrors: [],
        fieldErrors: { code: "Invalid verification code" },
      });
    }

    if (verification.expires_at < new Date()) {
      await prisma.verification.delete({
        where: { id: verification.id },
      });

      throw new FormError("Expired", {
        payload,
        formErrors: [],
        fieldErrors: {
          code: "Verification code has expired. Please request a new one.",
        },
      });
    }

    const user = verification.user;

    if (!user.email) {
      throw new FormError("Invalid", {
        payload,
        formErrors: [],
        fieldErrors: { code: "Invalid verification code" },
      });
    }

    if (user.email_verified) {
      await prisma.verification.delete({
        where: { id: verification.id },
      });

      throw new FormError("Already verified", {
        payload,
        formErrors: [],
        fieldErrors: { code: "Email is already verified" },
      });
    }

    const rateLimitResult = await applyRateLimit(
      request,
      verificationCodeRateLimit,
      user.id.toString(),
    );

    if (isRateLimitResponse(rateLimitResult)) {
      throw new FormError("Rate limit exceeded", {
        payload: {},
        formErrors: [],
        fieldErrors: {
          form: `Too many verification attempts. You can try again at ${rateLimitResult}`,
        },
      });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { email_verified: true, last_login_at: new Date() },
      }),
      prisma.verification.delete({
        where: { id: verification.id },
      }),
    ]);

    return user.id;
  }),
  "verify-change-email",
);

export async function logout(request: Request) {
  return authenticator.logout(request, { redirectTo: "/" });
}
