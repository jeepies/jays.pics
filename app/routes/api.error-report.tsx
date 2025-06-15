import { randomUUID } from "crypto";

import { ActionFunctionArgs, json } from "@remix-run/node";

import { prisma } from "~/services/database.server";
import { getSession, getUserBySession } from "~/services/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.has("userID") ? await getUserBySession(session) : null;

  let data: { message?: string; stack?: string };
  try {
    data = await request.json();
  } catch {
    return json({ success: false, message: "Invalid body" }, { status: 400 });
  }

  if (!data.message) {
    return json(
      { success: false, message: "Message required" },
      { status: 400 },
    );
  }

  const existing = await prisma.siteError.findFirst({
    where: { message: data.message, stack: data.stack ?? null },
  });

  if (existing) {
    if (user?.id && !existing.user_ids.includes(user.id)) {
      await prisma.siteError.update({
        where: { id: existing.id },
        data: { user_ids: { push: user.id } },
      });
    }
    return json({ success: true, code: existing.code });
  }

  const short = randomUUID().split("-")[0].slice(0, 4).toUpperCase();
  const code = `JP_ERR_${short}`;
  await prisma.siteError.create({
    data: {
      code,
      message: data.message,
      stack: data.stack,
      user_ids: user?.id ? [user.id] : [],
    },
  });
  return json({ success: true, code });
}

export async function loader() {
  return json({ success: false, message: "post only" }, { status: 405 });
}
