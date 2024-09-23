import {
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  getAllReferrals,
  getSession,
  getUserByID,
} from "~/services/session.server";

export let meta: MetaFunction = () => {
  return [{ name: "description", content: "Invite-only Image Hosting" }];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (params.id === "me") return redirect(`/profile/${session.get("userID")}`);
  const id = params.id ?? session.get("userID");

  const user = await getUserByID(id);
  const referrals = await getAllReferrals(id);

  if (user === null) return redirect(`/profile/${session.get("userID")}`);

  return { user, referrals };
}

export default function Profile() {
  const loaderData = useLoaderData<typeof loader>();

  return <></>;
}
