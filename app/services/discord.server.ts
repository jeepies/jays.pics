import { prisma } from "~/services/database.server";

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI!;

export async function authenticateWithDiscord(code: string, userId?: string) {
  const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const { access_token, token_type, expires_in, refresh_token, scope } =
    await tokenResponse.json();

  const userResponse = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const discordUser = await userResponse.json();

  let account = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: "discord",
        providerAccountId: discordUser.id,
      },
    },
    include: {
      user: true,
    },
  });

  if (userId) {
    const linkUser = await prisma.account.create({
      data: {
        type: "oauth",
        provider: "discord",
        providerAccountId: discordUser.id,
        access_token,
        token_type,
        expires_at: Math.floor(Date.now() / 1000 + expires_in),
        refresh_token,
        scope,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    const user = await prisma.user.findUnique({
      where: {
        id: linkUser.userId,
      },
    });
    if (user?.email === null) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          email: discordUser.email,
        },
      });
    }
    return user;
  }

  if (!account) {
    const user = await prisma.user.create({
      data: {
        username: `${discordUser.username}`,
        password: "",
        email: discordUser.email,
        referrer_profile: {
          create: {},
        },
        upload_preferences: {
          create: {},
        },
        accounts: {
          create: {
            type: "oauth",
            provider: "discord",
            providerAccountId: discordUser.id,
            access_token,
            token_type,
            expires_at: Math.floor(Date.now() / 1000 + expires_in),
            refresh_token,
            scope,
          },
        },
      },
    });
    return user;
  }

  await prisma.account.update({
    where: {
      id: account.id,
    },
    data: {
      access_token,
      refresh_token,
      expires_at: Math.floor(Date.now() / 1000 + expires_in),
    },
  });

  return account.user;
}
