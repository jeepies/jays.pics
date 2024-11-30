import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
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
  if(query !== null) {
    const urls = user.upload_preferences!.urls;
    let url;
    if (urls.length === 1) url = urls[0];
    else url = urls[Math.floor(Math.random() * urls.length)];
    clipboard = `https://${url}/i/${query}/`;
  }

  return { images, clipboard };
}

export default function Images() {
  const { images, clipboard } = useLoaderData<typeof loader>();

  if(clipboard) {
    navigator.clipboard.writeText(clipboard);
  }

  return (
    <div className="p-4">
      {images.map((image) => (
        <Card key={image.id}>
          <CardContent className="p-2">
            <img
              src={`/i/${image.id}/raw`}
              alt={image.display_name}
              className="aspect-square rounded-md object-cover h-12"
            />
            <p className="mt-2 truncate text-sm font-medium">
              <a href={`/i/${image.id}`}>{image.display_name}</a>
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(image.created_at).toLocaleDateString()}
            </p>
            <Form>
            <Link to={`?generate_link=${image.id}`}>
              <Button>Link</Button>
            </Link>
            </Form>
            <Link to={`/i/${image.id}/delete`}>
              <Button>Delete</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
