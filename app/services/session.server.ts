import { randomUUID } from "crypto";

import { createCookieSessionStorage, Session } from "@remix-run/node";

import { prisma } from "~/services/database.server";

const sessionSecret = process.env.SESSION_SECRET;

if (process.env.NODE_ENV === "production" && !sessionSecret) {
  throw new Error("SESSION_SECRET must be set in production");
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [sessionSecret ?? randomUUID()],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getUserBySession(session: Session) {
  const user = await prisma.user.findUnique({
    where: { id: session.get("userID") },
    select: {
      id: true,
      username: true,
      email: true,
      email_verified: true,
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
      StorageSubscription: true,
      notifications: {
        where: {
          seen: false,
        },
      },
    },
  });

  if (!user) return null;

  // if (!user.email || !user.email_verified) return null;

  return {
    ...user,
    max_space: Number(user.max_space),
    space_used: Number(user.space_used),
    StorageSubscription:
      user.StorageSubscription?.map((s) => ({
        ...s,
        storage: Number(s.storage),
      })) ?? [],
  };
}

export async function getUserByID(id: string) {
  const user = await prisma.user.findUnique({
    where: { id: id },
    select: {
      id: true,
      username: true,
      email: true,
      email_verified: true,
      images: true,
      created_at: true,
      badges: true,
      referrer_profile: true,
      pinned_images: true,
      avatar_url: true,
    },
  });

  if (!user) return null;

  // if (!user.email || !user.email_verified) return null;

  return user;
}

export async function getAllReferrals(referrer_id: string) {
  return await prisma.referral.findMany({
    where: { referrer_id: referrer_id },
  });
}

export const { getSession, commitSession, destroySession } = sessionStorage;
