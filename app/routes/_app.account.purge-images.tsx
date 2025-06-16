import { ActionFunctionArgs, json } from "@remix-run/node";
import { prisma } from "~/services/database.server";
import { del } from "~/services/s3.server";
import { getSession, getUserBySession } from "~/services/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) return json({ ok: false }, { status: 401 });

  const user = await getUserBySession(session);
  if (!user) return json({ ok: false }, { status: 401 });

  const images = await prisma.image.findMany({
    where: { uploader_id: user.id },
    select: { id: true, size: true },
  });

  for (const img of images) {
    await prisma.image.delete({ where: { id: img.id } });
    await del(`${user.id}/${img.id}`);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { space_used: 0n },
  });

  return json({ ok: true });
}
