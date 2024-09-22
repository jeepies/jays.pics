import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, redirect } from "@remix-run/react";
import { getSession } from "~/services/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Authorization | jays.host" },
    { name: "description", content: "Invite-only Image Hosting" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("userID")) return redirect("/dashboard");

  return null;
}

export default function Auth() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-gray-800 rounded p-6 w-1/4 h-1/2">
        <Outlet />
      </div>
    </div>
  );
}
