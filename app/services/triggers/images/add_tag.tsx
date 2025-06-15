import { prisma } from "~/services/database.server";

export default async function addTag({
  userId,
  imageId,
  data,
}: {
  userId: string;
  imageId: string;
  data: any;
}) {
  if (!data.tag) return;
  const tag = await prisma.tag.upsert({
    where: { user_id_name: { user_id: userId, name: data.tag } },
    update: {},
    create: { name: data.tag, user_id: userId },
  });
  await prisma.imageTag.upsert({
    where: { image_id_tag_id: { image_id: imageId, tag_id: tag.id } },
    update: {},
    create: { image_id: imageId, tag_id: tag.id },
  });
}
