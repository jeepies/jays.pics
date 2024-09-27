import type { ActionFunctionArgs, UploadHandler } from "@remix-run/node";
import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { prisma } from "~/services/database.server";

import { uploadStreamToS3 } from "~/services/s3.server";

const fileSizeCounter = async (
  data: AsyncIterable<Uint8Array>,
  abortAtBytes?: number
): Promise<number> => {
  let bytes = 0;
  for await (const x of data) {
    bytes += x.length;
    if (abortAtBytes && bytes > abortAtBytes) {
      break;
    }
  }
  return bytes;
};

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const s = Object.fromEntries(url.searchParams.entries());

  if (!s.upload_key)
    return json({
      success: false,
      message: "Upload key is not set",
    });

  const user = await prisma.user.findFirst({
    where: { upload_key: s.upload_key },
  });

  const uploadHandler: UploadHandler = composeUploadHandlers(
    // @ts-ignore
    async ({ name, filename, data }) => {
      if (name !== "image") {
        return undefined;
      }

      const fileSize = await fileSizeCounter(data, 1_048_576 * 10);

      if (fileSize > 1_048_576 * 10) {
        return {};
      }

      const image = await prisma.image.create({
        data: {
          display_name: filename!,
          uploader_id: user!.id,
          size: fileSize,
        },
      });

      await uploadStreamToS3(data, image.id);
      return image.id;
    },
    createMemoryUploadHandler()
  );
  const formData = await parseMultipartFormData(request, uploadHandler);
  const imgSrc = formData.get("image");
  if (!imgSrc || typeof imgSrc !== "string") {
    return json({
      errorMsg: "Something went wrong while uploading",
    });
  }

  return json({
    success: true,
    image: `http://${process.env.BASE_URL}/i/${imgSrc}`,
  });
}
