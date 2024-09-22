import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { prisma } from "../services/database.server";
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
    .max(256, { message: "Must be 256 or less characters" }),
  referralCode: z
    .string({ required_error: "Referral Code is required" })
    .uuid("Must be a valid referral code"),
});

export default function Register() {
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post">
      <div>{actionData?.formErrors}</div>
      <p>
        <input type="text" name="username"></input>
        <div>{actionData?.fieldErrors.username}</div>
      </p>
      <p>
        <input type="password" name="password"></input>
        <div>{actionData?.fieldErrors.password}</div>
      </p>
      <p>
        <input type="text" name="referralCode"></input>
        <div>{actionData?.fieldErrors.referralCode}</div>
      </p>
      <button type="submit">Sign Up</button>
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

  await prisma.user
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

  const referrer = await prisma.user.findFirst({
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

  var hashedPassword = bcrypt.hashSync(result.data.password, 10);
  const user = await prisma.user.create({
    data: { username: result.data.username, password: hashedPassword },
  });

  await prisma.referral.create({
    data: {
      referred_id: user.id,
      referrer_id: referrer.id,
    },
  });

  const session = await getSession(request.headers.get("Cookie"));
  session.set("userID", user.id);
  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
