import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { destroySession, getSession } from "~/services/session.server";

async function logout(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export async function action({ request }: ActionFunctionArgs) {
  logout(request);
}

export async function loader({ request }: LoaderFunctionArgs) {
  logout(request);
}
