import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { prisma } from "~/services/database.server";
import { del } from "~/services/s3.server";
import {
  destroySession,
  getSession,
  getUserBySession,
} from "~/services/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) return redirect("/login");

  const user = await getUserBySession(session);
  if (!user) return redirect("/login");

  const images = await prisma.image.findMany({
    where: { uploader_id: user.id },
    select: { id: true },
  });

  for (const img of images) {
    await prisma.image.delete({ where: { id: img.id } });
    await del(`${user.id}/${img.id}`);
  }

  await prisma.user.delete({ where: { id: user.id } });

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
