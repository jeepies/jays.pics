import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DataTable } from "~/components/ui/url-data-table";
import { Progress } from "~/lib/enums/progress";
import { prisma } from "~/services/database.server";
import { getSession, getUserBySession } from "~/services/session.server";

import { columns } from "./columns";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUserBySession(
    await getSession(request.headers.get("Cookie")),
  );

  const urls = await prisma.uRL.findMany({
    where: {
      donator_id: user!.id,
    },
    select: {
      url: true,
      public: true,
      created_at: true,
      last_checked_at: true,
      progress: true,
    },
  });

  return urls;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const user = await getUserBySession(
    await getSession(request.headers.get("Cookie")),
  );
  const url = formData.get("url");
  const actionType = formData.get("action");

  if (typeof url === "string") {
    const domain = await prisma.uRL.findUnique({
      where: { url },
      select: { donator_id: true, progress: true },
    });

    if (
      !domain ||
      domain.donator_id !== user!.id ||
      domain.progress !== Progress.DONE
    ) {
      return redirect("/dashboard/my-domains");
    }

    if (actionType === "make_public") {
      await prisma.uRL.update({
        where: { url },
        data: { public: true },
      });
    }

    if (actionType === "make_private") {
      await prisma.uRL.update({
        where: { url },
        data: { public: false },
      });
    }
  }

  return redirect("/dashboard/my-domains");
}

export default function MyDomains() {
  const urls = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Domains</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={urls} selected={[]} />
          <Button className="mt-2">
            <Link to="/dashboard/domain/add">Add Domain</Link>
          </Button>
          <Button className="mt-2 ml-2">
            <Link to="/dashboard/domain/add">Delete Domain(s)</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
