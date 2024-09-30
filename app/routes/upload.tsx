import { ActionFunctionArgs, json, MetaFunction, redirect } from "@remix-run/node";
import { z } from "zod";
import { prisma } from "~/services/database.server";
import { uploadToS3 } from "~/services/s3.server";

const schema = z.object({
  image: z.instanceof(File),
});

export const meta: MetaFunction = () => {
  return [
    { title: "Upload | jays.host" },
    { name: "description", content: "Administration Dashboard" },
    {
      name: "theme-color",
      content: "#f472b6",
    },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  const result = schema.safeParse(payload);

  if (!result.success) {
    return json({ success: false, errors: result.error });
  }

  const image = result.data.image;

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

  if (
    !["image/png", "image/gif", "image/jpeg", "image/webp"].includes(image.type)
  ) {
    return json({
      success: false,
      message: "Incorrect file type",
    });
  }

  if (user.space_used + image.size > user.max_space) {
    return json({
      success: false,
      message: "When uploading this image, your allocated space was exceeded.",
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

  await prisma.user.update({
    where: { id: user.id },
    data: { space_used: user.space_used + image.size },
  });

  const response = await uploadToS3(
    result.data.image,
    `${user.id}/${dbImage.id}`
  );
  if (response?.$metadata.httpStatusCode === 200) {
    return json({
      success: true,
      url: `${process.env.BASE_URL}/i/${dbImage.id}/`,
    });
  }

  return json({
    success: false,
    message: "An unknown error occured.",
  });
}

export async function loader() {
  return redirect("/");
}
