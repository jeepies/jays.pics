import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { prisma } from "~/services/database.server";
import { getSession, getUserBySession } from "~/services/session.server";

// TODO
// export const meta: MetaFunction<typeof loader> = ({data}) => {
//   if(!data) return [{title: "What?"}]
//   return [
//     {
//       property: "og:title",
//       content: data!.data.image!.display_name,
//     },
//     {
//       property: "image",
//       content: `${process.env.BASE_URL}/i/${data!.data.image!.id}/raw`
//     },
//   ];
// };

export async function loader({ request, params }: LoaderFunctionArgs) {
  const image = await prisma.image.findFirst({ where: { id: params.id } });
  const uploader = await prisma.user.findFirst({
    where: { id: image!.uploader_id },
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
