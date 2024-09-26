import { LoaderFunctionArgs, redirect } from "@remix-run/node";
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
  // render images on a grid
  return <h1>images</h1>;
}
