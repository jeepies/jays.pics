import { json, LoaderFunctionArgs } from "@remix-run/node";
import fs from "fs";
import { prisma } from "~/services/database.server";
import { get } from "~/services/s3.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const image = await prisma.image.findFirst({ where: { id: params.id } });
  if (!image) return json({ success: false, message: "Image does not exist" });
  const user = await prisma.user.findFirst({
    where: { id: image.uploader_id },
  });

  try {
    const s3Image = await get(`${user!.id}/${image.id}`);

    return new Response(s3Image, {
      headers: {
        "Content-Type": image.type,
        "Cache-Control":
          "public, immutable, no-transform, s-maxage=31536000, max-age=31536000",
      },
    });
  } catch {}

  return null;
}
