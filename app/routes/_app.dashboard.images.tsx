import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, CardContent } from "~/components/ui/card";
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

  const images = user.images;

  return { images };
}

export default function Images() {
  const { images } = useLoaderData<typeof loader>();

  return (
    <>
      {images.map((image) => (
        <Card key={image.id}>
          <CardContent className="p-2">
            <img
              src={`/api/images/${image.id}`}
              alt={image.display_name}
              className="aspect-square w-full rounded-md object-cover"
            />
            <p className="mt-2 truncate text-sm font-medium">
              {image.display_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(image.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
