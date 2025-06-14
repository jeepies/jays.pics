import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { prisma } from "~/services/database.server";
import { uploadToS3 } from "~/services/s3.server";
import { getSession, getUserBySession } from "~/services/session.server";
import type { DiscordUser } from "~/types/auth";

import { useAppLoaderData } from "./_app";
import { FaDiscord } from "react-icons/fa";

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) return redirect("/login");

  const user = await getUserBySession(session);
  if (!user) return redirect("/login");
  const formData = await request.formData();
  const type = formData.get("type");

  if (type === "update_username") {
    const username = formData.get("username");
    if (typeof username === "string" && username.length > 0) {
      const changedAt = Date.parse(
        user!.username_changed_at as unknown as string
      );
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      if (changedAt < sevenDaysAgo) {
        await prisma.user.update({
          where: { id: user!.id },
          data: {
            username,
            username_changed_at: new Date(),
            username_history: JSON.stringify([
              username,
              ...JSON.parse(user!.username_history as unknown as string),
            ]),
          },
        });
      }
    }
  }

  if (type === "unlink_discord") {
    await prisma.account.deleteMany({
      where: {
        user_id: user.id,
        provider: "discord",
      },
    });
  }

  return redirect("/dashboard/settings");
}

export async function loader({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) return redirect("/login");
  const user = await getUserBySession(session);
  if (!user) return redirect("/login");

  let discordAccount = await prisma.account.findFirst({
    where: {
      user_id: user.id,
      provider: "discord",
    },
  });

  let discordUser: DiscordUser | null = null;

  if (discordAccount) {
    let accessToken = discordAccount.access_token;

    if (new Date() > discordAccount.access_token_expires_at) {
      const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: process.env.DISCORD_CLIENT_ID!,
          client_secret: process.env.DISCORD_CLIENT_SECRET!,
          refresh_token: discordAccount.refresh_token,
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const newTokens = await tokenRes.json();

      if (newTokens.error) {
        await prisma.account.delete({ where: { id: discordAccount.id } });
        discordAccount = null;
      } else {
        accessToken = newTokens.access_token;
        discordAccount = await prisma.account.update({
          where: { id: discordAccount.id },
          data: {
            access_token: newTokens.access_token,
            access_token_expires_at: new Date(
              Date.now() + newTokens.expires_in * 1000
            ),
            refresh_token:
              newTokens.refresh_token ?? discordAccount.refresh_token,
          },
        });
      }
    }

    if (discordAccount) {
      const userRes = await fetch("https://discord.com/api/users/@me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(userRes);

      if (userRes.ok) {
        discordUser = (await userRes.json()) as DiscordUser;
      } else {
        await prisma.account.delete({ where: { id: discordAccount.id } });
        discordAccount = null;
        discordUser = null;
      }
    }
  }

  return json({
    user,
    discordLinked: !!discordAccount,
    discordUser,
    now: Date.now(),
  });
}

export default function Settings() {
  const data = useLoaderData<typeof loader>();
  if (!data || !data.user) {
    return <div>Unable to load user data.</div>;
  }
  console.log(data);
  const changedAt = Date.parse(data.user.username_changed_at);
  const sevenDaysAgo = Date.parse(
    new Date(data.now - 7 * 24 * 60 * 60 * 1000).toString()
  );
  const canChange = changedAt < sevenDaysAgo;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Discord</Label>
              {data.discordLinked && data.discordUser ? (
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage
                          src={`https://cdn.discordapp.com/avatars/${data.discordUser.id}/${data.discordUser.avatar}.png`}
                        />
                        <AvatarFallback>
                          {data.discordUser.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {data.discordUser.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {data.discordUser.email}
                        </p>
                      </div>
                    </div>
                    <Form method="post">
                      <Input type="hidden" name="type" value="unlink_discord" />
                      <Button variant="destructive" type="submit">
                        Unlink
                      </Button>
                    </Form>
                  </CardContent>
                </Card>
              ) : (
                <Form action="/auth/discord" method="post">
                  <Button variant="discord" type="submit">
                    <FaDiscord className="mr-2" />
                    Link Discord
                  </Button>
                </Form>
              )}
            </div>
            <Form method="post" className="space-y-2">
              <Input type="hidden" name="type" value="update_username" />
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                defaultValue={data.user.username}
                readOnly={!canChange}
                className="my-1"
              />
              {!canChange && (
                <p className="text-sm text-muted-foreground">
                  You can change your username every 7 days. Your last change
                  was {new Date(changedAt).toLocaleDateString()}.
                </p>
              )}
              {canChange && <Button type="submit">Update Username</Button>}
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
