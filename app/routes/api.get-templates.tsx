import { json } from "@remix-run/node";

export async function loader() {
  return json({
    success: true,
    data: {
      "image.name": "Gets the display name of the image",
      "image.size_bytes": "Gets the images size in bytes",
      "image.size": "Gets the human-readable image size",
      "image.created_at": "Gets the date the image was created on",

      "uploader.name": "Gets the uploader's username",
      "uploader.storage_used_bytes": "Gets the uploader's storage used",
      "uploader.storage_used": "Gets the human-readable uploader's storage used",
      "uploader.total_storage_bytes": "Gets the uploader's total storage capacity",
      "uploader.total_storage": "Gets the human-readable uploader's total storage capacity",
    },
  });
}