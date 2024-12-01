import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { getSession } from "~/services/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Authorization | jays.pics" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("userID")) return redirect("/dashboard/index");
  return null;
}
