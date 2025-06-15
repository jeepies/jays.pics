import { promisify } from "node:util";
import { gzip } from "node:zlib";

import { LoaderFunctionArgs } from "@remix-run/node";

import { prisma } from "~/services/database.server";
import { getSession, getUserBySession } from "~/services/session.server";

const gzipAsync = promisify(gzip);

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) {
    return new Response("Unauthorized", { status: 401 });
  }
  const user = await getUserBySession(session);
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const rawData = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      username: true,
      email: true,
      avatar_url: true,
      badges: true,
      username_history: true,
      username_changed_at: true,
      space_used: true,
      max_space: true,
      pinned_images: true,
      created_at: true,
      updated_at: true,
      images: true,
      comments: true,
      image_comments: true,
      referrals: true,
      donated_urls: true,
      notifications: true,
      ImageReport: true,
      Tag: true,
      CommentReport: true,
      referrer_profile: true,
      upload_preferences: true,
    },
  });

  const data = rawData
  ? {
      ...rawData,
      space_used: Number(rawData.space_used),
      max_space: Number(rawData.max_space),
    }
  : null;

  const json = JSON.stringify(data, null, 2);
  const gz = await gzipAsync(json);

  return new Response(gz, {
    headers: {
      "Content-Type": "application/gzip",
      "Content-Disposition": `attachment; filename="${user.username}-data.json.gz"`,
    },
  });
}

export async function action() {
  return new Response("Method not allowed", { status: 405 });
}
