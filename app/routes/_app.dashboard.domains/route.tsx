import { Progress } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DataTable } from "~/components/ui/url-data-table";
import { prisma } from "~/services/database.server";

import { columns } from "./columns";

export async function loader() {
  return await prisma.uRL.findMany({
    where: {
      progress: Progress.DONE,
    },
    select: {
      url: true,
      donator: {
        select: {
          username: true,
        },
      },
      public: true,
      created_at: true,
      last_checked_at: true,
    },
  });
}

export default function Domain() {
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
            <Link to="/dashboard/my-domains">My Domains</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
