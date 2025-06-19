import { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { authenticator, FormError } from "~/services/auth.server";

export default function Forgot() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="space-y-4 dark text-white">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
      </div>

      {actionData && typeof actionData === "string" && (
        <div className="p-3 rounded-md bg-green-50 border border-green-200">
          <p className="text-sm text-green-800">
            If an account with that email exists, we've sent you a password
            reset link.
          </p>
        </div>
      )}

      {actionData &&
        typeof actionData === "object" &&
        actionData.fieldErrors?.form && (
          <div className="p-3 rounded-md bg-red-50 border border-red-200">
            <p className="text-sm text-red-800">
              {actionData.fieldErrors.form}
            </p>
          </div>
        )}

      <Form className="space-y-4" method="post">
        <div className="space-y-1">
          <Label htmlFor="email">
            Email Address{" "}
            <span className="text-red-500 text-sm dark:text-red-400">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            required
            defaultValue={
              actionData && typeof actionData === "object"
                ? actionData.payload?.email
                : ""
            }
          />
          <div className="text-red-500 text-sm dark:text-red-400">
            {actionData && typeof actionData === "object"
              ? actionData.fieldErrors?.email
              : ""}
          </div>
        </div>

        <Button className="w-full" type="submit">
          Send Reset Link
        </Button>
      </Form>

      <div className="text-left">
        <p className="text-sm">
          Remember your password?
          <Button variant="link" asChild>
            <Link to="/login">Back to login</Link>
          </Button>
        </p>
      </div>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    return await authenticator.authenticate("forgot-password", request);
  } catch (error) {
    if (error instanceof Response) throw error;
    if (error instanceof FormError) return error.data;
    throw error;
  }
}
