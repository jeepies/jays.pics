import { createCookieSessionStorage, Session } from '@remix-run/node';

import { prisma } from '~/services/database.server';

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET ?? 'totally_secret'],
    secure: process.env.NODE_ENV === 'production',
  },
});

export async function getUserBySession(session: Session) {
  return await prisma.user.findUnique({
    where: { id: session.get('userID') },
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

export async function getAllReferrals(referrer_id: string) {
  return await prisma.referral.findMany({
    where: { referrer_id: referrer_id },
  });
}

export const { getSession, commitSession, destroySession } = sessionStorage;
