import type {
  LoaderFunctionArgs,
  MetaFunction,
  ActionFunctionArgs,
} from "@remix-run/node";
import {
  Outlet, // dont forget this guy :3
  redirect,
  useLoaderData,
  Form,
  useActionData,
  Link,
} from "@remix-run/react";
import { getSession, commitSession } from "~/services/session.server";
import { prisma } from "~/services/database.server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "jays.host" },
    { name: "description", content: "Invite-only Image Hosting" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const usersCount = await prisma.user.count();

  if (session.has("userID")) return redirect("/dashboard");

  return { firstTime: usersCount === 0 };
}

const schema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(3, { message: "Must be 3 or more characters" })
    .max(20, { message: "Must be 20 or less characters" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Must be 8 or more characters" })
    .max(256, { message: "Must be 256 or less characters" }),
});

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

  const hashedPassword = bcrypt.hashSync(result.data.password, 10);
  const user = await prisma.user.create({
    data: { username: result.data.username, password: hashedPassword },
  });

  const session = await getSession(request.headers.get("Cookie"));
  session.set("userID", user.id);

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Index() {
  const { firstTime } = useLoaderData<{ firstTime: boolean }>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex h-screen items-center justify-center">
      {firstTime ? (
        <Form className="space-y-4" method="post">
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
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
            Create Initial Account
          </Button>
        </Form>
      ) : (
        <>
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Register</Link>
          </Button>
        </>
      )}
    </div>
  );
}
