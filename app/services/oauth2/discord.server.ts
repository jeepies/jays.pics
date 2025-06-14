import { DiscordTokenResponse, DiscordUser, OAuth2Token } from "~/types/auth";
import { prisma } from "../database.server";

export function getAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID!,
    redirect_uri: process.env.BASE_URL! + "/auth/discord/callback",
    response_type: "code",
    scope: "identify email",
    ...(state && { state }),
  });

  return `https://discord.com/api/oauth2/authorize?${params}`;
}

export async function generateVerificationCode(): Promise<string> {
  const code = Math.random().toString(36).substring(2, 15);
  const expiresAt = new Date(Date.now() + 3 * 60 * 1000);
  await prisma.verification.create({
    data: { code, expires_at: expiresAt },
  });
  return code;
}

export async function verifyVerificationCode(code: string): Promise<boolean> {
  const verification = await prisma.verification.findFirst({
    where: { code, expires_at: { gt: new Date() } },
  });
  return !!verification;
}

export async function getTokens(code: string): Promise<DiscordTokenResponse> {
  const body = new URLSearchParams();
  body.set("client_id", process.env.DISCORD_CLIENT_ID!);
  body.set("client_secret", process.env.DISCORD_CLIENT_SECRET!);
  body.set("grant_type", "authorization_code");
  body.set("code", code);
  body.set("redirect_uri", process.env.BASE_URL! + "/auth/discord/callback");

  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      accept: "application/json",
    },
    body,
  });

  if (response.status === 401) {
    throw new Error("Invalid code, please try again.");
  }

  if (!response.ok) {
    throw new Error("Failed to get tokens");
  }

  const data = await response.json();
  console.log(data);

  return data;
}

export async function getUser(accessToken: string): Promise<DiscordUser> {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get user info");
  }

  return response.json();
}

export async function getRefreshToken(
  refreshToken: string
): Promise<DiscordTokenResponse> {
  const body = new URLSearchParams();
  body.set("grant_type", "refresh_token");
  body.set("refresh_token", refreshToken);
  body.set("client_id", process.env.DISCORD_CLIENT_ID!);
  body.set("client_secret", process.env.DISCORD_CLIENT_SECRET!);
  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!response.ok) {
    throw new Error("Failed to get refresh token");
  }
  const data = await response.json();
  const tokens: DiscordTokenResponse = {
    access_token: data.access_token,
    expires_in: data.expires_in,
    refresh_token: data.refresh_token,
    scope: data.scope,
    token_type: data.token_type,
  };
  const userID = await getUser(tokens.access_token);
  if (!userID) {
    throw new Error("Failed to get user info");
  }
  const account = await prisma.account.findFirst({
    where: {
      provider_id: userID.id,
      provider: "discord",
    },
  });
  if (!account) {
    throw new Error("User not found");
  }
  await prisma.account.upsert({
    where: {
      id: account.id,
    },
    create: {
      user_id: userID.id,
      provider_id: userID.id,
      provider: "discord",
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      id_token: tokens.token_type,
      scope: tokens.scope,
      access_token_expires_at: new Date(Date.now() + tokens.expires_in * 1000),
      refresh_token_expires_at: new Date(Date.now() + tokens.expires_in * 1000),
    },
    update: {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      scope: tokens.scope,
    },
  });
  return tokens;
}
