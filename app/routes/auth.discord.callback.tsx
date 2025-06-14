import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { prisma } from "~/services/database.server";
import { verifyVerificationCode } from "~/services/oauth2/discord.server";
import {
  getUserByDiscordID,
  linkDiscordAccount,
  getSession,
  commitSession,
  destroySession,
  getUserByAccount,
} from "~/services/session.server";
import { DiscordTokenResponse, DiscordUser } from "~/types/auth";

function logError(context: string, error: unknown) {
  console.error(
    `[Discord OAuth] ${context}:`,
    error instanceof Error ? error.message : error
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  let session = await getSession(request.headers.get("Cookie"));

  const sessionState = session.get("discord_oauth_state");
  if (!sessionState) {
    logError("Missing state", { sessionState });
    return redirect("/login?error=missing_state");
  }
  const validState = await verifyVerificationCode(sessionState);
  if (!validState) {
    logError("Invalid state", { sessionState });
    return redirect("/login?error=invalid_state");
  }
  await prisma.verification.delete({
    where: { id: sessionState },
  });
  session.unset("discord_oauth_state");

  if (!code) {
    logError("Missing code param", url.search);
    return redirect("/login?error=missing_code");
  }

  try {
    const formData = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code: code.toString(),
      redirect_uri: process.env.BASE_URL! + "/auth/discord/callback",
    });

    const response = await fetch("https://discord.com/api/v10/oauth2/token", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        accept: "application/json",
      },
      body: formData,
    });
    if (!response.ok) {
      logError("Token exchange failed", await response.text());
      return redirect("/login?error=code_invalid");
    }
    const tokenData: DiscordTokenResponse = await response.json();

    const userInfo = await fetch("https://discord.com/api/v10/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    if (!userInfo.ok) {
      logError("User info fetch failed", await userInfo.text());
      return redirect("/login?error=refresh_token_invalid");
    }
    const userData: DiscordUser = await userInfo.json();
    const currentUserID = session.get("userID");

    // linking account
    if (currentUserID) {
      const linkResult = await linkDiscordAccount(
        currentUserID,
        tokenData.access_token
      );
      if (linkResult.success) {
        return redirect("/dashboard/index", {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        });
      } else {
        logError("Link account failed", linkResult.message);
        return json({ error: linkResult.message }, { status: 400 });
      }
    }

    // attempt to login
    const existingUser = await getUserByDiscordID(userData.id);
    if (existingUser) {
      const newSession = await getSession();
      newSession.set("userID", existingUser.id);
      return redirect("/dashboard/index", {
        headers: {
          "Set-Cookie": await commitSession(newSession),
        },
      });
    }
    const user = await getUserByAccount("discord", userData.id);
    if (user) {
      const newSession = await getSession();
      newSession.set("userID", user.id);
      return redirect("/dashboard/index", {
        headers: {
          "Set-Cookie": await commitSession(newSession),
        },
      });
    }
    return redirect("/login?error=discord_account_not_linked");
  } catch (err) {
    logError("OAuth callback error", err);
    return redirect("/login?error=internal_error", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
}
