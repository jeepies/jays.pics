import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/services/database.server";
import { EmailVerification } from "~/components/email-verification";
import { getSession, getUserBySession } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) {
    return new Response("Unauthorized", { status: 401 });
  }
  const user = await getUserBySession(session);
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!user.email || user.email_verified) {
    return redirect("/");
  }
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  let status: "pending" | "success" | "invalid" = "pending";

  if (token && token.startsWith("jp-") && token.endsWith("-ce")) {
    const verification = await prisma.verification.findFirst({
      where: { code: token },
    });
    if (verification) {
      const user = await prisma.user.findUnique({
        where: { id: verification.user_id },
      });
      await prisma.$transaction([
        prisma.user.update({
          where: { id: user?.id },
          data: { email_verified: true, last_login_at: new Date() },
        }),
        prisma.verification.deleteMany({
          where: { user_id: user?.id },
        }),
      ]);
      if (user) {
        status = "success";
      } else {
        status = "invalid";
      }
    } else {
      status = "invalid";
    }
  }

  return json({ status, email: user.email });
}

export default function VerifyEmail() {
  const { status, email } = useLoaderData<typeof loader>();

  const handleResendClick = () => {
    return redirect("/verify/resend");
  };

  if (status === "success") {
    return redirect("/");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <EmailVerification
        email={email}
        variant={status}
        onResendClick={handleResendClick}
      />
    </div>
  );
}
