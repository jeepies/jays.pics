import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { destroySession, getSession } from "~/services/session.server";
import { Sidebar } from "flowbite-react";
import { HiCog, HiHome, HiLogout } from "react-icons/hi";
import { HiPhoto, HiUserCircle } from "react-icons/hi2";
import { prisma } from "~/database.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard | jays.host" },
    { name: "description", content: "Invite-only Image Hosting" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("userID")) return redirect("/");

  const user = await prisma.user.findUnique({
    where: { id: session.get("userID") },
    select: {
      username: true,
      images: true,
      referral_code: true,
    },
  });

  if (user === null)
    return redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });

  return { user };
}

export default function Application() {
  const actionData = useLoaderData<typeof loader>();

  return (
    <>
      <Sidebar aria-label="Sidebar" className="h-screen">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item href="/dashboard" icon={HiHome}>
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item
              href="/dashboard/images"
              icon={HiPhoto}
              label={actionData.user.images.length}
              labelColor="dark"
            >
              Images
            </Sidebar.Item>
            <Sidebar.Item href="/dashboard/settings" icon={HiCog}>
              Settings
            </Sidebar.Item>
            <div className="absolute bottom-2">
              <Sidebar.Item href="/profile/me" icon={HiUserCircle}>
                {actionData.user.username}
              </Sidebar.Item>
              <Sidebar.Item href="/logout" icon={HiLogout}>
                Log out
              </Sidebar.Item>
            </div>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
      <div className="">
        <Outlet />
      </div>
    </>
  );
}
