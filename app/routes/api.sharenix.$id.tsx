import { json, LoaderFunctionArgs } from "@remix-run/node";
import { M } from "node_modules/vite/dist/node/types.d-aGj9QkWt";
import { prisma } from "~/services/database.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const user = await prisma.user.findFirst({ where: { id: params.id } });

  if (!user) {
    return json({
      success: false,
      message: "Invalid user",
    });
  }

  const config = {
    DefaultImageUploader: "jays.pics",
    DefaultUrlShortener: "jays.pics",
    DefaultFileUploader: "jays.pics",
    ClipboardTime: 5,
    Services: [
      {
        Name: "jays.pics",
        RequestType: "POST",
        RequestURL: `https://jays.pics/upload?upload_key=${user.upload_key}`,
        FileFormName: "image",
        ResponseType: "Text",
        URL: "$json.url$",
      },
    ],
  };

  return new Response(JSON.stringify(config), {
    headers: {
      "Content-Disposition": `attachment; filename="sharenix.json"`,
      "Content-Type": "application/json",
    },
  });
}
