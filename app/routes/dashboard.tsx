import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { getSession } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("userID")) return redirect("/");

  return null;
}

export default function Dashboard() {
  return (
    <Form method="post" action="/logout">
      <button type="submit">Log out</button>
    </Form>
  );
}
