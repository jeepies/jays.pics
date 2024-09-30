import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { templateReplacer } from "~/lib/utils";
import { prisma } from "~/services/database.server";
import { getSession, getUserBySession } from "~/services/session.server";
import prettyBytes from "pretty-bytes";
import { Sidebar } from "~/components/ui/sidebar";
import { SidebarGuest } from "~/components/ui/sidebar-guest";
import { Card, CardContent } from "~/components/ui/card";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const image = await prisma.image.findFirst({ where: { id: params.id } });
  if (!image) return redirect("/");
  const uploader = await prisma.user.findFirst({
    where: { id: image!.uploader_id },
    select: {
      username: true,
      upload_preferences: true,
      space_used: true,
      max_space: true,
    },
  });

  const session = await getSession(request.headers.get("Cookie"));
  const user = session.has("userID")
    ? await getUserBySession(session)
    : { id: "", username: "Guest", is_admin: false };

  return { data: { image: image, uploader: uploader }, user };
}

export default function Image() {
  const { data, user } = useLoaderData<typeof loader>();

  // {data.image !== null ? (
  //   <>
  //     <img src={`/i/${data.image.id}/raw`} />
  //     {user !== null ? (
  //       <>comment box with comment ability</>
  //     ) : (
  //       <>comment box, but no comment ability :(</>
  //     )}
  //   </>
  // ) : (
  //   <>no image</>
  // )}

  return (
    <div className="flex h-screen overflow-hidden">
      {user!.id !== "" ? (
        <Sidebar
          user={{ username: user!.username, is_admin: user!.is_admin }}
          className="border-r"
        />
      ) : (
        <SidebarGuest className="border-r" />
      )}
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full h-2/3">
          <CardContent>
          <img
              src={`/i/${data.image.id}/raw`}
            />
          </CardContent>
        </Card>
      </div>
      {/* <div className="flex-grow rounded w-full h-full overflow-auto p-8">
        <div className="w-full h-full">
          <div className="w-full h-2/3">
            <img
              src={`/i/${data.image.id}/raw`}
              className="max-h-full max-w-full"
            />
          </div>
        </div>
      </div> */}
    </div>
  );
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [{ title: `Image | jays.host ` }];

  const dictionary = {
    "image.name": data.data.image?.display_name,
    "image.size_bytes": data.data.image?.size,
    "image.size": prettyBytes(data.data.image!.size),
    "image.created_at": data.data.image?.created_at,

    "uploader.name": data.data.uploader?.username,
    "uploader.storage_used_bytes": data.data.uploader?.space_used,
    "uploader.storage_used": prettyBytes(data.data.uploader!.space_used),
    "uploader.total_storage_bytes": data.data.uploader?.max_space,
    "uploader.total_storage": prettyBytes(data.data.uploader!.max_space),
  };

  const title = templateReplacer(
    data.data.uploader?.upload_preferences?.embed_title ?? "",
    dictionary
  );

  return [
    { title: data.data.image?.display_name },
    { property: "og:title", content: title },
    { property: "og:description", content: "" },
    { property: "og:type", content: "website" },
    {
      property: "og:url",
      content: `https://jays.pics/i/${data.data.image?.id}`,
    },
    {
      property: "og:image",
      content: `https://jays.pics/i/${data.data.image?.id}/raw${data.data.image.type === 'image/gif' ? '.gif' : ''}`,
    },
    {
      name: "theme-color",
      content: data.data.uploader?.upload_preferences?.embed_colour,
    },
    {
      tagName: "link",
      type: "application/json+oembed",
      href: `https://jays.pics/i/${data.data.image!.id}/oembed.json`,
    },
    { name: "twitter:card", content: "summary_large_image" },
  ];
};
