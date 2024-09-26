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

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center gap-1">
      <Button asChild>
        <Link to="/login">Login</Link>
      </Button>
      <Button asChild>
        <Link to="/register">Register</Link>
      </Button>
    </div>
  );
}
