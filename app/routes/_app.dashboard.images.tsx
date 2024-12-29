import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Filters } from "~/components/image-filter";
import { Grid } from "~/components/image-grid";
import { generateInvisibleURL } from "~/lib/utils";
import { prisma } from "~/services/database.server";
import {
  destroySession,
  getSession,
  getUserBySession,
} from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("userID")) return redirect("/");

  const user = await getUserBySession(session);

  if (user === null)
    return redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });

  const images = await prisma.image.findMany({
    where: { uploader_id: user.id },
  });

  const url = new URL(request.url);
  const query = url.searchParams.get("generate_link");

  let clipboard;
  if (query !== null) {
    const urls = user.upload_preferences!.urls;
    let url;
    if (urls.length === 1) url = urls[0];
    else url = urls[Math.floor(Math.random() * urls.length)];

    const formedURL = `https://${url}/i/${query}/`;
    let returnableURL = formedURL;

    if (user.upload_preferences?.domain_hack) {
      returnableURL = generateInvisibleURL(returnableURL);
    }

    clipboard = returnableURL;
  }

  const page = Number(url.searchParams.get("page")) || 1;
  const perPage = Number(url.searchParams.get("perPage")) || 24;
  const sortBy = url.searchParams.get("sortBy") || "created_at";
  const sortOrder = url.searchParams.get("sortOrder") || "desc";
  const search = url.searchParams.get("search") || "";

  return { images, clipboard, page, perPage, sortBy, sortOrder, search };
}

export default function Images() {
  const { images, clipboard, page, perPage, sortBy, sortOrder, search } =
    useLoaderData<typeof loader>();

  const seralizedImages = images.map((image) => ({
    id: image.id,
    uploader_id: image.uploader_id,
    display_name: image.display_name,
    size: image.size,
    type: image.type,
    privacy: image.privacy,
    created_at: new Date(image.created_at),
    updated_at: new Date(image.updated_at),
    deleted_at: image.deleted_at ? new Date(image.deleted_at) : null,
  }));

  if (clipboard) {
    navigator.clipboard.writeText(clipboard);
    window.location.href = "/dashboard/images";
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Image Gallery</h1>
        <Filters initialSearch={search} />
        <Grid images={seralizedImages} />
      </div>
    </div>
  );
}
