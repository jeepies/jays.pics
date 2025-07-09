import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
  json,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useState } from "react";
import { AuthorizationError } from "remix-auth";
import { Button } from "~/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { Label } from "~/components/ui/label";
import { authenticator, FormError } from "~/services/auth.server";
import { prisma } from "~/services/database.server";
import { sendVerificationEmail } from "~/services/resend.server";
import { getSession, getUserBySession } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const url = new URL(request.url);
  const resent = url.searchParams.get("resent");
  const error = url.searchParams.get("error");

  if (!session.has("userID")) {
    return redirect("/login");
  }

  const user = await getUserBySession(session);

  if (user === null) {
    return redirect("/login");
  }

  if (user.email_verified) {
    return redirect("/dashboard/index");
  }

  if (!user.email) {
    return redirect("/login");
  }

  const verification = await prisma.verification.findFirst({
    where: {
      user_id: user.id,
    },
  });

  if (!verification && !user.email_verified && user.email) {
    await sendVerificationEmail(user.email.toLowerCase(), false);
  }

  if (verification?.expires_at && verification.expires_at < new Date()) {
    await prisma.verification.delete({
      where: {
        id: verification.id,
      },
    });
    await sendVerificationEmail(user.email.toLowerCase(), false);
  }

  return json({
    email: user.email.toLowerCase(),
    resent: resent === "true",
    error: error ?? null,
  });
}

export default function Verify() {
  const { email, resent, error } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [code, setCode] = useState("");

  const isSubmitting = navigation.state === "submitting";
  const isCodeComplete = code.length === 6;
  const isValidCode = /^\d{6}$/.test(code);
  const hasInvalidCharacters = code.length > 0 && !/^\d*$/.test(code);

  const hasFieldErrors = actionData && "fieldErrors" in actionData;

  return (
    <div className="space-y-4 dark text-white">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a verification code to{" "}
            <span className="font-medium">{email}</span>. Enter the 6-digit code
            below to verify your account.
          </p>
        </div>
      </div>

      {resent && (
        <div className="p-3 rounded-md bg-green-50 border border-green-200">
          <p className="text-sm text-green-800">
            Verification code sent successfully!
          </p>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {hasFieldErrors && actionData.fieldErrors?.form && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-800">{actionData.fieldErrors.form}</p>
        </div>
      )}

      <Form method="post" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="verification-code" className="text-center">
            Verification Code
          </Label>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              name="code"
              value={code}
              onChange={(value) => setCode(value)}
              disabled={isSubmitting}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          {hasFieldErrors &&
            actionData.fieldErrors &&
            "code" in actionData.fieldErrors &&
            actionData.fieldErrors.code && (
              <p className="text-sm text-red-600 mt-1">
                {actionData.fieldErrors.code}
              </p>
            )}
          {hasInvalidCharacters && (
            <p className="text-sm text-amber-600 mt-1 text-center">
              Verification code must contain only numbers
            </p>
          )}
          {isCodeComplete && !isValidCode && !hasInvalidCharacters && (
            <p className="text-sm text-amber-600 mt-1 text-center">
              Verification code must be exactly 6 digits
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!isCodeComplete || !isValidCode || isSubmitting}
        >
          {isSubmitting ? "Verifying..." : "Verify Code"}
        </Button>
      </Form>

      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          {"Didn't receive the code?"}
        </p>
        <Form method="post" action="/verify/resend">
          <Button variant="link" type="submit" disabled={isSubmitting}>
            Resend Code
          </Button>
        </Form>
      </div>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    return await authenticator.authenticate("verify", request, {
      successRedirect: "/dashboard/index",
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
