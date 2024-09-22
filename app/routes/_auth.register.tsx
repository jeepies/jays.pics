import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { prisma } from "../database.server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { commitSession, getSession } from "~/services/session.server";

export default function Register() {
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post">
      <p>
        <input type="text" name="username"></input>
      </p>
      <p>
        <input type="password" name="password"></input>
      </p>
      <p>
        <input type="text" name="referral-code"></input>
      </p>
      <button type="submit">Sign Up</button>
    </Form>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = String(formData.get("username")),
    password = String(formData.get("password")),
    referralCode = String(formData.get("referral-code"));

  try {
    const userSchema = z.object({
      username: z
        .string()
        .min(3, { message: "Must be 3 or more characters" })
        .max(20, { message: "Must be 20 or less characters" }),
      password: z
        .string()
        .min(8, { message: "Must be 8 or more characters" })
        .max(256, { message: "Must be 256 or less characters" }),
      referralCode: z.string().uuid("Must be a valid referral code"),
    });

    userSchema.parse({
      username: username,
      password: password,
      referralCode: referralCode,
    });

    await prisma.user
      .findFirst({ where: { username: username } })
      .then((user) => {
        if (user !== null) return json({ username: "This username is taken." });
      });

    var salt = bcrypt.genSaltSync();
    var hashedPassword = bcrypt.hashSync(password, salt);

    const user = await prisma.user.create({
      data: { username: username, password: hashedPassword },
    });

    const session = await getSession(request.headers.get("Cookie"));
    session.set("userID", user.id);

    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.issues);
      return json({ error: error.issues });
    }
    return json({ error: "An unknown error occured. Please try again." });
  }
}
