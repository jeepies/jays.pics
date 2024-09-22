import {
  ActionFunctionArgs,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
  UploadHandler,
} from "@remix-run/node";
import { s3UploadHandler } from "~/services/s3.server";

export async function action({ request }: ActionFunctionArgs) {
  const uploadHandler: UploadHandler = composeUploadHandlers(
    s3UploadHandler,
    createMemoryUploadHandler()
  );

  
}
