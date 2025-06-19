import { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { AuthorizationError } from "remix-auth";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { authenticator, FormError } from "~/services/auth.server";

export default function Register() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="space-y-4 dark text-white">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Register</h1>
        <p className="text-sm text-muted-foreground">
          Create an account to get started.
        </p>
      </div>

      {actionData && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-800">{actionData.fieldErrors.form}</p>
        </div>
      )}
      <Form className="space-y-4" method="post">
        <div className="space-y-1">
          <Label htmlFor="email">Email (optional)</Label>
          <Input id="email" name="email" placeholder="Email" type="email" />
          <div className="text-red-500 text-sm dark:text-red-400">
            {actionData?.fieldErrors.email}
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="username">
            Username{" "}
            <span className="text-red-500 text-sm dark:text-red-400">*</span>
          </Label>
          <Input
            id="username"
            name="username"
            placeholder="Username"
            required
          />
          <div className="text-red-500 text-sm dark:text-red-400">
            {actionData?.fieldErrors.username}
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">
            Password{" "}
            <span className="text-red-500 text-sm dark:text-red-400">*</span>
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="*********"
            required
          />
          <div className="text-red-500 text-sm dark:text-red-400">
            {actionData?.fieldErrors.password}
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="referralCode">
            Referral Code{" "}
            <span className="text-red-500 text-sm dark:text-red-400">*</span>
          </Label>
          <Input
            id="referralCode"
            name="referralCode"
            placeholder="JX7s..."
            required
          />
          <div className="text-red-500 text-sm dark:text-red-400">
            {actionData?.fieldErrors.referralCode}
          </div>
        </div>
        <Button className="w-full" type="submit">
          Sign Up
        </Button>
        <p className="mt-4 text-sm">
          Already have an account?
          <Button variant="link" asChild>
            <Link to="/login">Log in</Link>
          </Button>
        </p>
      </Form>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    return await authenticator.authenticate("register", request, {
      successRedirect: "/dashboard/index",
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    if (error instanceof AuthorizationError) {
      if (error.cause instanceof FormError) return error.cause.data;
    }
    if (error instanceof FormError) return error.data;
    throw error;
  }
}
