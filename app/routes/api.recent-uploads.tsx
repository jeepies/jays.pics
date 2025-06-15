import { json, LoaderFunctionArgs } from "@remix-run/node";

import { prisma } from "~/services/database.server";
import { getSession, getUserBySession } from "~/services/session.server";

export async function action() {
  return json({ error: "POST not supported" });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const uploadKey = url.searchParams.get("upload_key");
  let user = null;

  if (uploadKey) {
    user = await prisma.user.findFirst({ where: { upload_key: uploadKey } });
  } else {
    const session = await getSession(request.headers.get("Cookie"));
    if (!session.has("userID")) return json({ error: "Not authorized" });
    user = await getUserBySession(session);
  }

  if (!user) return json({ error: "Not authorized" });

  const images = await prisma.image.findMany({
    where: { uploader_id: user.id },
    take: 5,
  });

  return json(images);
}
