import { createReadableStreamFromReadable, json, LoaderFunctionArgs } from "@remix-run/node";
import { prisma } from "~/services/database.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const user = await prisma.user.findFirst({ where: { id: params.id } });

  if(!user) {
    return json({
        success: false,
        message: "Invalid user"
    })
  }

  const config = {
    Version: "16.1.0",
    Name: "jays.host",
    DestinationType: "ImageUploader, FileUploader",
    RequestMethod: "POST",
    Parameters: {
      upload_key: user.upload_key,
    },
    Body: "MultipartFormData",
    FileFormName: "image"
  };

  return new Response(JSON.stringify(config), {
    headers: {
        'Content-Disposition': `attachment; filename="${user.username}.json"`,
        'Content-Type': 'application/json',
    }
  })
}
