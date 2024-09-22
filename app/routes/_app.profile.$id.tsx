import {
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  getSession,
  getUserByID,
  getUserBySession,
} from "~/services/session.server";

export let meta: MetaFunction = () => {
  return [
    { name: "description", content: "Invite-only Image Hosting" },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (params.id === "me") return redirect(`/profile/${session.get("userID")}`);

  const user = await getUserByID(params.id ?? session.get("userID"));

  return { user };
}

export default function Profile() {
  const loaderData = useLoaderData<typeof loader>();
}
