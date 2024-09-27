import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/services/database.server";
import { getSession, getUserBySession } from "~/services/session.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const image = await prisma.image.findFirst({ where: { id: params.id } });

  // @TODO get image url, if exists on CloudFront. if not, get from S3 and upload to cloudfront for a limited duration

  const session = await getSession(request.headers.get("Cookie"));
  const user = (await getUserBySession(session)) ?? {};
  return { image, user };
}

export default function Image() {
  const { image, user } = useLoaderData<typeof loader>();

  return <>
  {image !== null ? <>image found {user !== null ? <>comment box with comment ability</>:<>comment box, but no comment ability :(</>}</> : <>no image</>}
  </>
}
