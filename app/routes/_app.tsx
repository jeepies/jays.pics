import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import {
  destroySession,
  getSession,
  getUserBySession,
} from "~/services/session.server";
import { Sidebar } from "~/components/ui/sidebar";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard | jays.pics" },
    { name: "description", content: "Invite-only Image Hosting" },
    {
      name: "theme-color",
      content: "#e05cd9",
    },
  ];
};

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

  const now = Date.now();

  return { user, now };
}

export default function Application() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={user} className="border-r" />
      <div className="flex-grow rounded w-full h-full overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export function useAppLoaderData() {
  return useRouteLoaderData<typeof loader>("routes/_app");
}
