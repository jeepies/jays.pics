import { LoaderFunctionArgs } from "@remix-run/node";

import { prisma } from "~/services/database.server";
import { get } from "~/services/s3.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user || !user.avatar_url)
    return new Response("Not found", { status: 404 });

  const data = await get(user.avatar_url);
  return new Response(data, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control":
        "public, immutable, no-transform, s-maxage=31536000, max-age=31536000",
    },
  });
}
