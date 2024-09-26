import type { ActionFunctionArgs, UploadHandler } from "@remix-run/node";
import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { Form, useActionData, useFetcher } from "@remix-run/react";
import { prisma } from "~/services/database.server";

import { s3UploadHandler } from "~/services/s3.server";

export async function action({ request }: ActionFunctionArgs) {
  const uploadHandler: UploadHandler = composeUploadHandlers(
    s3UploadHandler,
    createMemoryUploadHandler()
  );
  const formData = await parseMultipartFormData(request, uploadHandler);
  const imgSrc = formData.get("img");
  if (!imgSrc) {
    return json({
      errorMsg: "Something went wrong while uploading",
    });
  }

  return json({
    imgSrc,
  });
  {
  }
}

export default function Upload() {
  return (
    <>
      <Form method="post" encType="multipart/form-data">
        <label htmlFor="img-field">Image to upload</label>
        <input id="img-field" type="file" name="img" accept="image/*" />
        <button type="submit">Upload</button>
      </Form>
    </>
  );
}
