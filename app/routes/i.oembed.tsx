import { json, LoaderFunctionArgs } from "@remix-run/node";
import { prisma } from "~/services/database.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const image = await prisma.image.findFirst({ where: { id: params.id } });
  if (!image) return json({ success: false, message: "Image does not exist" });
  return json({
    provider_name: "Hosted with 🩵 at jays.pics",
    provider_url: "https://jays.pics",
    type: "photo",
  });
}
