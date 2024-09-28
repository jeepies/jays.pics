import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { prisma } from "../services/database.server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { commitSession, getSession } from "~/services/session.server";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

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
    <Form className="space-y-4" method="post">
      <div className="space-y-1">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="Username"
          required
        />
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
          placeholder="Password"
          required
        />
        <div className="text-red-500 text-sm">
          {actionData?.fieldErrors.password}
        </div>
      </div>
      <Button className="w-full" type="submit">
        Login
      </Button>
      <p className="mt-4 text-center text-sm">
        Don&apos;t have an account?
        <a
          href="/register"
          className="ml-1 text-primary hover:underline focus:outline-none"
        >
          Sign up
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

  if (result.data.username === "system") {
    return {
      payload,
      formErrors: [],
      fieldErrors: {
        username: "Invalid account",
        password: "",
      },
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

  return redirect("/dashboard/index", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
