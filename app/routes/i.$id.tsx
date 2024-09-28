import { LinksFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { templateReplacer } from "~/lib/utils";
import { prisma } from "~/services/database.server";
import { getSession, getUserBySession } from "~/services/session.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const image = await prisma.image.findFirst({ where: { id: params.id } });
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
  let user;
  if (session.get("userId")) {
    user = await getUserBySession(session);
  }

  return { data: { image: image, uploader: uploader }, user };
}

export default function Image() {
  const { data, user } = useLoaderData<typeof loader>();

  return (
    <>
      {data.image !== null ? (
        <>
          <img src={`/i/${data.image.id}/raw`} />
          {user !== null ? (
            <>comment box with comment ability</>
          ) : (
            <>comment box, but no comment ability :(</>
          )}
        </>
      ) : (
        <>no image</>
      )}
    </>
  );
}

// TODO
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [{ title: `Image | jays.host ` }];

  // TODO translate bytes to human readable
  const dictionary = {
    "image.name": data.data.image?.display_name,
    "image.size_bytes": data.data.image?.size,
    "image.size": data.data.image?.size,
    "image.created_at": data.data.image?.created_at,

    "uploader.name": data.data.uploader?.username,
    "uploader.storage_used_bytes": data.data.uploader?.space_used,
    "uploader.storage_used": data.data.uploader?.space_used,
    "uploader.total_storage_bytes": data.data.uploader?.max_space,
    "uploader.total_storage": data.data.uploader?.max_space,
  };

  const title = templateReplacer(
    data.data.uploader?.upload_preferences?.embed_title ?? "",
    dictionary
  );

  return [
    { title: data.data.image?.display_name },
    { property: "og:title", content: title },
    { property: "og:description", content: `og:description lol` },
    { property: "og:type", content: "website"},
    { property: "og:url", content: `https://jays.pics/i/${data.data.image?.id}` },
    { property: "og:image", content: `https://jays.pics/i/${data.data.image?.id}/raw` },
    { property: "theme-color", cotent: data.data.uploader?.upload_preferences?.embed_colour},
    {
      tagName: "link",
      type: "application/json+oembed",
      href: `/i/${data.data.image!.id}/oembed.json`,
    },
    { name: "twitter:card", content: "summary_large_image" },
  ];
};
