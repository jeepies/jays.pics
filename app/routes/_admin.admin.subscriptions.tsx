import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import prettyBytes from "pretty-bytes";

import { PAGE_SIZE, Pagination } from "~/components/pagination";
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

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const count = await prisma.storageSubscription.count();
  const subs = await prisma.storageSubscription.findMany({
    include: { user: { select: { id: true, username: true } } },
    orderBy: { created_at: "desc" },
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  return { count, subs, page };
}

export default function AdminSubscriptions() {
  const { count, subs, page } = useLoaderData<typeof loader>();

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Storage Subscriptions</CardTitle>
        <CardDescription>There are {count} subscriptions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">User</TableHead>
              <TableHead>Storage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subs.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell className="font-medium">
                  <a href={`/admin/user/${sub.user.id}`}>{sub.user.username}</a>
                </TableCell>
                <TableCell>{prettyBytes(Number(sub.storage))}</TableCell>
                <TableCell>
                  {sub.cancelled_at ? "Cancelled" : "Active"}
                </TableCell>
                <TableCell className="text-right">
                  {new Date(sub.created_at).toLocaleDateString()} @{" "}
                  {new Date(sub.created_at).toLocaleTimeString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          path="/admin/subscriptions"
          currentPage={page}
          totalCount={count}
        />
      </CardContent>
    </Card>
  );
}
