import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { applyRateLimit, isRateLimitResponse } from "~/lib/rate-limit";
import {
  authenticator,
  FormError,
  redirectIfUser,
} from "~/services/auth.server";
import { loginRateLimit } from "~/services/redis.server";

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <Form className="space-y-4 dark text-white" method="post">
      <div className="space-y-1">
        <Label htmlFor="username">Username or Email</Label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="Username or Email"
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
  const user = await redirectIfUser(request);
  if (user) {
    return redirect("/dashboard/index");
  }

  const rateLimitResult = await applyRateLimit(request, loginRateLimit);
  if (isRateLimitResponse(rateLimitResult)) {
    return rateLimitResult;
  }

  try {
    return await authenticator.authenticate("login", request, {
      successRedirect: "/dashboard/index",
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    if (error instanceof FormError) return error.data;
    throw error;
  }
}
