import { ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { applyRateLimit, isRateLimitResponse } from "~/lib/rate-limit";
import { authenticator, FormError } from "~/services/auth.server";
import { registrationRateLimit } from "~/services/redis.server";

export default function Register() {
  const actionData = useActionData<typeof action>();

  return (
    <Form className="space-y-4 dark text-white" method="post">
      <div className="space-y-1">
        <Label htmlFor="email">Email (optional)</Label>
        <Input id="email" name="email" placeholder="Email" type="email" />
        <div className="text-red-500 text-sm dark">
          {actionData?.fieldErrors.email}
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="username">
          Username <span className="text-red-500 text-sm dark">*</span>
        </Label>
        <Input id="username" name="username" placeholder="Username" required />
        <div className="text-red-500 text-sm dark">
          {actionData?.fieldErrors.username}
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">
          Password <span className="text-red-500 text-sm dark">*</span>
        </Label>
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
        <Label htmlFor="referralCode">
          Referral Code <span className="text-red-500 text-sm dark">*</span>
        </Label>
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
  const rateLimitResult = await applyRateLimit(request, registrationRateLimit);
  if (isRateLimitResponse(rateLimitResult)) {
    return rateLimitResult;
  }

  try {
    return await authenticator.authenticate("register", request, {
      successRedirect: "/dashboard/index",
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    if (error instanceof FormError) return error.data;
    throw error;
  }
}
