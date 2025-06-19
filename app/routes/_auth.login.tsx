import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { authenticator, FormError } from "~/services/auth.server";

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="space-y-4 dark text-white">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-sm text-muted-foreground">
          Enter your username and password to login.
        </p>
      </div>

      {actionData && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-800">{actionData.fieldErrors.form}</p>
        </div>
      )}
      <Form className="space-y-4" method="post">
        <div className="space-y-1">
          <Label htmlFor="username">
            Username or Email{" "}
            <span className="text-red-500 text-sm dark">*</span>
          </Label>
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">
              Password <span className="text-red-500 text-sm dark">*</span>
            </Label>
            <Button variant="link" asChild>
              <Link to="/forgot">Forgot password?</Link>
            </Button>
          </div>
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
        <p className="mt-4 text-sm">
          Don&apos;t have an account?
          <Button variant="link" asChild>
            <Link to="/register">Sign up</Link>
          </Button>
        </p>
      </Form>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
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
