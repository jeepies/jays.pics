import { createCookieSessionStorage, Session } from "@remix-run/node";

import { prisma } from "~/services/database.server";
import { getRefreshToken, getTokens, getUser } from "./oauth2/discord.server";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET ?? "totally_secret"],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getUserBySession(session: Session) {
  return await prisma.user.findUnique({
    where: { id: session.get("userID") },
    select: {
      id: true,
      username: true,
      images: true,
      referrer_profile: true,
      upload_preferences: true,
      is_admin: true,
      upload_key: true,
      username_changed_at: true,
      username_history: true,
      max_space: true,
      space_used: true,
      pinned_images: true,
      avatar_url: true,
      notifications: {
        where: {
          seen: false,
        },
      },
    },
  });
}

export async function getUserByID(id: string) {
  return await prisma.user.findUnique({
    where: { id: id },
    select: {
      id: true,
      username: true,
      images: true,
      created_at: true,
      badges: true,
      referrer_profile: true,
      pinned_images: true,
      avatar_url: true,
    },
  });
}

export async function getUserByDiscordID(id: string) {
  return await prisma.user.findFirst({
    where: { Account: { some: { provider_id: id, provider: "discord" } } },
    select: {
      id: true,
      username: true,
      images: true,
      referrer_profile: true,
      upload_preferences: true,
      is_admin: true,
      upload_key: true,
      username_changed_at: true,
      username_history: true,
      max_space: true,
      space_used: true,
      pinned_images: true,
      avatar_url: true,
      notifications: {
        where: {
          seen: false,
        },
      },
    },
  });
}

export async function getUserByAccount(provider: string, provider_id: string) {
  return await prisma.user.findFirst({
    where: {
      Account: { some: { provider_id: provider_id, provider: provider } },
    },
  });
}

export async function getAllReferrals(referrer_id: string) {
  return await prisma.referral.findMany({
    where: { referrer_id: referrer_id },
  });
}

export async function linkDiscordAccount(userID: string, accessToken: string) {
  const exists = await prisma.account.findFirst({
    where: {
      provider_id: userID,
      provider: "discord",
    },
  });
  if (exists) {
    return {
      success: false,
      message: "Account already linked to another user",
    };
  }

  const discordUser = await getUser(accessToken);
  const tokens = await getTokens(accessToken);
  const refreshToken = await getRefreshToken(tokens.refresh_token);
  const account = await prisma.account.create({
    data: {
      user_id: userID,
      provider_id: discordUser.id,
      provider: "discord",
      scope: "identify email",
      access_token: refreshToken.access_token,
      id_token: tokens.access_token,
      access_token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      refresh_token_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      refresh_token: refreshToken.refresh_token,
    },
  });

  if (!account) {
    return {
      success: false,
      message: "Failed to link account, please try again later.",
    };
  }

  return {
    success: true,
    message: "Account linked successfully",
  };
}

export const { getSession, commitSession, destroySession } = sessionStorage;
