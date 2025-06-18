import { ActionFunctionArgs, redirect } from "@remix-run/node";
import {
  getSession,
  getUserBySession,
  destroySession,
} from "~/services/session.server";
import { sendVerificationEmail } from "~/services/resend.server";
import { generateCode } from "~/lib/code";
import { prisma } from "~/services/database.server";
import {
  emailVerificationRateLimit,
  checkRateLimit,
  getIP,
} from "~/services/redis.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) return redirect("/");

  const user = await getUserBySession(session);
  if (user === null)
    return redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });

  if (!user.email) return redirect("/dashboard/index");
  if (user.email_verified) return redirect("/dashboard/index");

  const clientIP = getIP(request);
  const rateLimitResult = await checkRateLimit(
    emailVerificationRateLimit,
    clientIP
  );

  if (!rateLimitResult.success) {
    return redirect(
      `/verify?error=rate_limited&reset=${rateLimitResult.reset.getTime()}`
    );
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

    await sendVerificationEmail(user.email, verify.code);
    return redirect("/verify?success=resent");
  } catch (error) {
    console.error("Error resending verification email:", error);
    return redirect("/verify?error=true");
  }
}

export async function loader() {
  return redirect("/verify");
}
