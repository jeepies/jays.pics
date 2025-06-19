import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { AuthorizationError } from "remix-auth";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { authenticator, FormError } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("token");

  if (!code) {
    throw redirect("/forgot");
  }

  return { code };
}

export default function ResetPassword() {
  const { code } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="space-y-4 dark text-white">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below.
        </p>
      </div>

      {actionData?.payload?.form && (
        <div className="p-3 rounded-md bg-green-50 border border-green-200">
          <p className="text-sm text-green-800">
            Your password has been reset successfully. You can now log in.
          </p>
        </div>
      )}

      {actionData?.fieldErrors?.form && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-800">
            {actionData?.fieldErrors?.form}
          </p>
        </div>
      )}

      <Form className="space-y-4" method="post">
        <Input type="hidden" id="token" name="token" value={code} />

        <div className="space-y-1">
          <Label htmlFor="password">
            New Password{" "}
            <span className="text-red-500 text-sm dark:text-red-400">*</span>
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your new password"
            required
            minLength={8}
            defaultValue={
              actionData && typeof actionData === "object"
                ? actionData.payload?.password
                : ""
            }
          />
          <div className="text-red-500 text-sm dark:text-red-400">
            {actionData && typeof actionData === "object"
              ? actionData.fieldErrors?.password
              : ""}
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirmPassword">
            Confirm New Password{" "}
            <span className="text-red-500 text-sm dark:text-red-400">*</span>
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your new password"
            required
            minLength={8}
            defaultValue={
              actionData && typeof actionData === "object"
                ? actionData.payload?.confirmPassword
                : ""
            }
          />
          <div className="text-red-500 text-sm dark:text-red-400">
            {actionData && typeof actionData === "object"
              ? actionData.fieldErrors?.confirmPassword
              : ""}
          </div>
        </div>

        <Button className="w-full" type="submit">
          Reset Password
        </Button>
      </Form>

      <div className="text-left">
        <p className="text-sm">
          Remember your password?{" "}
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
    return await authenticator.authenticate("reset-password", request, {
      successRedirect: "/login?message=success",
    });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      if (error.cause instanceof FormError) return error.cause.data;
    }
    if (error instanceof Response) throw error;
    if (error instanceof FormError) return error.data;
    throw error;
  }
}
