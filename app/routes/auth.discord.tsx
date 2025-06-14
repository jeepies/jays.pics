import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  generateVerificationCode,
  getAuthUrl,
} from "~/services/oauth2/discord.server";
import { commitSession, getSession } from "~/services/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo") || "/dashboard/index";

  const session = await getSession(request.headers.get("Cookie"));
  const authUrl = getAuthUrl(redirectTo);
  const code = await generateVerificationCode();
  session.set("discord_oauth_state", code);
  return redirect(authUrl, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function loader() {
  return redirect("/login");
}
