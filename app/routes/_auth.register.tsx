import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { prisma } from "~/services/database.server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { commitSession, getSession } from "~/services/session.server";

const schema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(3, { message: "Must be 3 or more characters" })
    .max(20, { message: "Must be 20 or less characters" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Must be 8 or more characters" })
    .max(256, { message: "Must be 256 or less characters" })
    .regex(
      /([!?&-_]+)/g,
      "Insecure password - Please add one (or more) of (!, ?, &, - or _)"
    )
    .regex(
      /([0-9]+)/g,
      "Insecure password - Please add one (or more) digit (0-9)"
    ),
  referralCode: z
    .string({ required_error: "Referral Code is required" })
    .uuid("Must be a valid referral code"),
});

export default function Register() {
  const actionData = useActionData<typeof action>();

  return (
    <Form className="space-y-4" method="post">
      <div className="space-y-1">
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" placeholder="jeepies" required />
        <div className="text-red-500 text-sm">
          {actionData?.fieldErrors.username}
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="*********"
          required
        />
        <div className="text-red-500 text-sm">
          {actionData?.fieldErrors.password}
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="referralCode">Referral Code</Label>
        <Input
          id="referralCode"
          name="referralCode"
          placeholder="JX7s..."
          required
        />
        <div className="text-red-500 text-sm">
          {actionData?.fieldErrors.referralCode}
        </div>
      </div>
      <Button className="w-full" type="submit">
        Sign Up
      </Button>
      <p className="mt-4 text-center text-sm">
        Already have an account?
        <a
          href="/login"
          className="ml-1 text-primary hover:underline focus:outline-none"
        >
          Log in
        </a>
      </p>
    </Form>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  const result = schema.safeParse(payload);

  if (!result.success) {
    const error = result.error.flatten();
    return {
      payload,
      formErrors: error.formErrors,
      fieldErrors: error.fieldErrors,
    };
  }

  prisma.user
    .findFirst({ where: { username: result.data.username } })
    .then((user) => {
      if (user !== null)
        return {
          payload,
          formErrors: [],
          fieldErrors: {
            username: "This username already exists",
            password: "",
            referralCode: "",
          },
        };
    });

  const referrer = await prisma.referrerProfile.findFirst({
    where: { referral_code: result.data.referralCode },
  });

  if (referrer === null) {
    return {
      payload,
      formErrors: [],
      fieldErrors: {
        username: "",
        password: "",
        referralCode: "This referral code is invalid",
      },
    };
  }

  const referralsAlreadyUsed = (
    await prisma.referral.findMany({ where: { referrer_id: referrer.id } })
  ).length;

  if (referralsAlreadyUsed === referrer.referral_limit) {
    return {
      payload,
      formErrors: [],
      fieldErrors: {
        username: "",
        password: "",
        referralCode: "This referral code has been used too many times",
      },
    };
  }

  const hashedPassword = bcrypt.hashSync(result.data.password, 10);

  const count = await prisma.user.count();

  let badges;
  if (count < 100) {
    badges = JSON.stringify([
      { name: "user", text: "User" },
      { name: "early", text: "Early" },
    ]);
  }

  const user = await prisma.user.create({
    data: {
      username: result.data.username,
      password: hashedPassword,
      referrer_profile: {
        create: {},
      },
      upload_preferences: {
        create: {},
      },
      last_login_at: new Date(),
      badges: badges,
    },
  });
  
  await prisma.referral.create({
    data: {
      referred_id: user.id,
      referrer_id: referrer.id,
    },
  });

  const session = await getSession(request.headers.get("Cookie"));
  session.set("userID", user.id);
  return redirect("/dashboard/index", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
