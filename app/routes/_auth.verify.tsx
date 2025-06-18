// app/routes/verify.tsx
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { Mail, ArrowLeft } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "~/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { Label } from "~/components/ui/label";
import { generateCode } from "~/lib/code";
import { applyRateLimit, isRateLimitResponse } from "~/lib/rate-limit";
import { authenticator, FormError } from "~/services/auth.server";
import { prisma } from "~/services/database.server";
import { emailVerificationRateLimit } from "~/services/redis.server";
import { sendVerificationEmail } from "~/services/resend.server";
import { getSession, getUserBySession } from "~/services/session.server";

type ActionData = {
  error?: string;
  success?: string;
};

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("userID")) {
    return redirect("/login?error=not_authenticated");
  }

  const user = await getUserBySession(session);

  if (user === null) {
    return redirect("/login?error=user_not_found");
  }

  if (user.email_verified) {
    return redirect("/dashboard/index");
  }

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "resend") {
    const rateLimitResult = await applyRateLimit(
      request,
      emailVerificationRateLimit,
    );
    if (isRateLimitResponse(rateLimitResult)) {
      const data = await rateLimitResult.json();
      const resetTime = new Date(data.reset);
      return redirect(
        `/verify?error=rate_limited&reset=${resetTime.getTime()}`,
      );
    }

    let userEmail: string | null = null;
    if (!user.email_verified) {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { email: true },
      });
      userEmail = dbUser?.email ?? null;
      if (!userEmail) {
        return redirect("/verify?error=no_email");
      }
    }

    try {
      await prisma.verification.deleteMany({
        where: { user_id: user.id },
      });

      const verify = await prisma.verification.create({
        data: {
          user_id: user.id,
          code: generateCode(),
          expires_at: new Date(Date.now() + 1 * 60 * 60 * 1000),
        },
      });

      if (userEmail) {
        await sendVerificationEmail(userEmail, verify.code);
      }

      return redirect("/verify?success=resent");
    } catch (error) {
      console.error("Error resending verification email:", error);
      return redirect("/verify?error=resend_failed");
    }
  }

  const rateLimitResult = await applyRateLimit(
    request,
    emailVerificationRateLimit,
  );
  if (isRateLimitResponse(rateLimitResult)) {
    const data = await rateLimitResult.json();
    const resetTime = new Date(data.reset);
    return redirect(`/verify?error=rate_limited&reset=${resetTime.getTime()}`);
  }

  try {
    return await authenticator.authenticate("verify", request, {
      successRedirect: "/dashboard/index",
    });
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    if (error instanceof FormError) {
      return redirect(
        `/verify?error=${error.data?.formErrors[0] || "invalid_code"}`,
      );
    }
    console.error("Unknown error during verification:", error);
    return redirect("/verify?error=unknown_error");
  }
}

export default function Verify() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  const resetTimestamp = searchParams.get("reset");
  const resetDate = resetTimestamp
    ? new Date(parseInt(resetTimestamp)).toLocaleTimeString()
    : null;

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                Check your email
              </CardTitle>
              <CardDescription className="mt-2">
                We sent a verification code to your email address. Enter the
                6-digit code below to verify your account.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Handle URL parameter errors */}
            {searchParams.get("error") === "not_authenticated" && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-800">
                  You are not authenticated. Please log in.
                </p>
              </div>
            )}
            {searchParams.get("error") === "user_not_found" && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-800">
                  User not found. Please log in again.
                </p>
              </div>
            )}
            {searchParams.get("error") === "rate_limited" && (
              <div className="p-3 rounded-md bg-yellow-50 border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  You are making too many requests. Please wait{" "}
                  {resetDate ? `until ${resetDate}` : "a moment"} before
                  requesting another code.
                </p>
              </div>
            )}
            {searchParams.get("error") === "resend_failed" && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-800">
                  Failed to resend verification code. Please try again.
                </p>
              </div>
            )}
            {searchParams.get("error") === "no_email" && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-800">
                  No email address found for your account. Please contact
                  support.
                </p>
              </div>
            )}
            {searchParams.get("error") === "invalid_code" && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-800">
                  The verification code is incorrect or expired.
                </p>
              </div>
            )}
            {searchParams.get("error") === "unknown_error" && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-800">
                  An unexpected error occurred. Please try again.
                </p>
              </div>
            )}

            {searchParams.get("success") === "resent" && (
              <div className="p-3 rounded-md bg-green-50 border border-green-200">
                <p className="text-sm text-green-800">
                  Verification code resent successfully! Check your inbox.
                </p>
              </div>
            )}

            {/* Handle action data errors */}
            {actionData?.error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-800">{actionData.error}</p>
              </div>
            )}

            <Form method="post" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} name="code">
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
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={searchParams.get("error") === "rate_limited"}
              >
                Verify Code
              </Button>
            </Form>

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                {"Didn't receive the code?"}
              </p>
              <Form method="post">
                <input type="hidden" name="intent" value="resend" />
                <Button
                  variant="outline"
                  className="w-full"
                  type="submit"
                  disabled={searchParams.get("error") === "rate_limited"}
                >
                  Resend Code
                </Button>
              </Form>
            </div>

            <div className="text-center">
              <Button variant="ghost" className="text-sm" asChild>
                <a href="/login">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to login
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
