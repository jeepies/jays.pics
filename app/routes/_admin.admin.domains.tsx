import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { prisma } from "~/services/database.server";

export async function loader({}: LoaderFunctionArgs) {
  const count = await prisma.uRL.count();
  const urls = await prisma.uRL.findMany({
    select: {
      url: true,
      public: true,
      progress: true,
      zone_id: true,
      donator: {
        select: {
          id: true,
          username: true,
        },
      },
      created_at: true,
    },
  });

  return { count, urls };
}

export default function Users() {
  const { count, urls } = useLoaderData<typeof loader>();

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Domains</CardTitle>
        <CardDescription>There are {count} domains</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-96">Domain</TableHead>
              <TableHead className="max-w-96">Public</TableHead>
              <TableHead className="max-w-96">Status</TableHead>
              <TableHead className="max-w-96">Zone</TableHead>
              <TableHead className="max-w-96">Donator</TableHead>
              <TableHead className="text-right">Date of Creation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {urls.map((url) => {
              return (
                <TableRow>
                  <TableCell className="font-medium">{url.url}</TableCell>
                  <TableCell>{url.public ? "Yes" : "No"}</TableCell>
                  <TableCell>{url.progress}</TableCell>
                  <TableCell>{url.zone_id}</TableCell>
                  <TableCell>
                    <a href={`/admin/profile/${url.donator!.id}`}>
                      {url.donator!.username}
                    </a>
                  </TableCell>
                  <TableCell className="text-right">
                    {new Date(url.created_at).toLocaleDateString()} @
                    {new Date(url.created_at).toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
