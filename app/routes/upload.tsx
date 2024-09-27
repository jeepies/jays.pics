import { ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import { prisma } from "~/services/database.server";
import { uploadToS3 } from "~/services/s3.server";

const schema = z.object({
  image: z.instanceof(File),
});

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  const result = schema.safeParse(payload);

  if (!result.success) {
    return json({ success: false, errors: result.error });
  }

  const image = result.data.image

  const url = new URL(request.url);
  const paramEntries = Object.fromEntries(url.searchParams.entries());

  if (!paramEntries.upload_key)
    return json({
      success: false,
      message: "Upload key is not set",
    });


  const user = await prisma.user.findFirst({
    where: { upload_key: paramEntries.upload_key },
  });

  if (!user) {
    return json({
      success: false,
      message: "You are not authorised",
    });
  }

  const dbImage = await prisma.image.create({
    data: {
      display_name: image.name,
      uploader_id: user!.id,
      size: image.size,
      type: image.type,
    },
  });

  const response = await uploadToS3(result.data.image, `${user.id}/${dbImage.id}`);
  if (response?.$metadata.httpStatusCode === 200) {
    return true;
  }

  return null;
}
