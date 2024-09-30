import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { SidebarAdmin } from "~/components/ui/sidebar-admin";
import {
  destroySession,
  getSession,
  getUserBySession,
} from "~/services/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Admin Dashboard | jays.host" },
    { name: "description", content: "Administration Dashboard" },
    {
      name: "theme-color",
      content: "#f472b6",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("userID")) return redirect("/");

  const user = await getUserBySession(session);

  if (!user?.is_admin) return redirect("/");

  if (user === null)
    return redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });

  return user;
}

export default function AdminDashboard() {
  const user = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarAdmin user={user} className="border-r" />
      <div className="flex-grow rounded w-full h-full overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function useAdminLoader() {
  return useRouteLoaderData<typeof loader>("routes/_admin");
}
