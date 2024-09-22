import { Prisma } from "@prisma/client";
import { createCookieSessionStorage, Session } from "@remix-run/node";
import { prisma } from "~/services/database.server";

export let sessionStorage = createCookieSessionStorage({
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
      username: true,
      images: true,
      referral_code: true,
    },
  });
}

export async function getUserByID(id: string) {
  return await prisma.user.findUnique({
    where: { id: id },
    select: {
      username: true,
      images: true,
      referral_code: true,
    },
  });
}

export let { getSession, commitSession, destroySession } = sessionStorage;
