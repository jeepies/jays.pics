import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { authenticateWithDiscord } from "~/services/discord.server";
import { getSession, commitSession } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return redirect("/login?error=discord_auth_failed");
  }

  if (!code) {
    const params = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      redirect_uri: process.env.DISCORD_REDIRECT_URI!,
      response_type: "code",
      scope: "identify email",
    });

    return redirect(`https://discord.com/api/oauth2/authorize?${params}`);
  }

  try {
    const session = await getSession(request.headers.get("Cookie"));
    const userID = session.get("userID");
    const user = await authenticateWithDiscord(code, userID);
    if (!user) {
      return redirect("/login?error=auth_failed");
    }
    session.set("userID", user.id);

    return redirect("/dashboard/index", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    return redirect("/login?error=auth_failed");
  }
}
