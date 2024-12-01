import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { GetUserByID } from "~/services/models/user.server";
import { getSession } from "~/services/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "jays.pics" },
    { name: "description", content: "V2!! yippie!!" },
    {
      name: "theme-color",
      content: "#474787",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = await GetUserByID(session.get("userID"));
  return user;
}

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">

    </div>
  );
}