import { redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { z } from "zod";

import { generateCode } from "~/lib/code";

import { prisma } from "./database.server";
import { sendVerificationEmail } from "./resend.server";
import { getUserBySession, getSession, sessionStorage } from "./session.server";

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
  const session = await getSession(request.headers.get("Cookie"));
  const user = await getUserBySession(session);
  if (user && !user.email_verified && user.email) {
    return redirect("/verify");
  }
  return authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard/index",
  });
}

const loginSchema = z.object({
  username: z
    .string({ required_error: "Username or email is required" })
    .min(3, "Must be 3 or more characters"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Must be 8 or more characters")
    .max(256, "Must be 256 or less characters"),
});

authenticator.use(
  new FormStrategy(async ({ form, request }) => {
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

    const isEmail = result.data.username.includes("@");

    const user = await prisma.user.findFirst({
      where: isEmail
        ? { email: result.data.username }
        : { username: result.data.username },
    });

    if (user === null) {
      throw new FormError("Missing", {
        payload,
        formErrors: [],
        fieldErrors: {
          username: isEmail
            ? "No account found with this email address"
            : "This username does not exist",
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
      /([!?&-_]+)/g,
      "Insecure password - Please add one (or more) of (!, ?, &, - or _)",
    )
    .regex(
      /([0-9]+)/g,
      "Insecure password - Please add one (or more) digit (0-9)",
    ),
  email: z.string().email({ message: "Invalid email address" }),
  referralCode: z
    .string({ required_error: "Referral Code is required" })
    .uuid("Must be a valid referral code"),
});

authenticator.use(
  new FormStrategy(async ({ form, request }) => {
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

    if (await prisma.user.findFirst({ where: { email: result.data.email } })) {
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

    const verification = await prisma.verification.create({
      data: {
        user_id: user.id,
        code: generateCode(),
        expires_at: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
      },
    });

    await sendVerificationEmail(result.data.email, verification.code);

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
  code: z.string({ required_error: "Code is required" }).min(6, "Invalid code"),
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

    const user = await prisma.user.findFirst({
      where: {
        Verification: {
          every: {
            code: result.data.code,
            expires_at: { lte: new Date() },
          },
        },
      },
      select: {
        email: true,
        id: true,
        Verification: {
          select: {
            id: true,
            expires_at: true,
          },
        },
      },
    });

    if (user === null || !user.email) {
      throw new FormError("Invalid", {
        payload,
        formErrors: [],
        fieldErrors: { code: "Invalid code" },
      });
    }

    if (user.Verification.length === 0) {
      throw new FormError("Invalid", {
        payload,
        formErrors: [],
        fieldErrors: { code: "Invalid code" },
      });
    }

    if (user.Verification[0].expires_at < new Date()) {
      throw new FormError("Expired", {
        payload,
        formErrors: [],
        fieldErrors: { code: "Code has expired" },
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { email_verified: true, last_login_at: new Date() },
    });

    await prisma.verification.delete({
      where: { id: user.Verification[0].id },
    });

    return user.id.toString();
  }),
  "verify",
);

export async function logout(request: Request) {
  return authenticator.logout(request, { redirectTo: "/" });
}
