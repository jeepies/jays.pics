import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { prisma } from "../database.server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { commitSession, getSession } from "~/services/session.server";

const schema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(3, "Must be 3 or more characters")
    .max(20, "Must be 20 or less characters"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Must be 8 or more characters")
    .max(256, "Must be 256 or less characters"),
});

export default function Login() {
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
      <button type="submit">Log in</button>
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

  const user = await prisma.user.findFirst({
    where: { username: result.data.username },
  });

  if (user === null) {
    return {
      payload,
      formErrors: [],
      fieldErrors: {
        username: "This username does not exist",
        password: "",
      },
    };
  }

  if (!(await bcrypt.compare(result.data.password, user.password))) {
    return {
      payload,
      formErrors: [],
      fieldErrors: {
        username: "",
        password: "Incorrect password",
      },
    };
  }

  const session = await getSession(request.headers.get("Cookie"));
  session.set("userID", user.id);

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
