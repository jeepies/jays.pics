import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DataTable } from "~/components/ui/url-data-table";
import { columns } from "./columns";
import { LoaderFunctionArgs } from "@remix-run/node";
import { prisma } from "~/services/database.server";
import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Progress } from "@prisma/client";
import { getSession, getUserBySession } from "~/services/session.server";

export async function loader({request}:LoaderFunctionArgs) {
  const user = await getUserBySession(await getSession(request.headers.get("Cookie")));

  return await prisma.uRL.findMany({
    where: {
      donator_id: user!.id
    },
    select: {
      url: true,
      public: true,
      created_at: true,
      last_checked_at: true,
      progress: true
    },
  });
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
