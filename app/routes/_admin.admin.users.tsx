import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

import { PAGE_SIZE, Pagination } from "~/components/pagination";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
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
  const search = url.searchParams.get("search") ?? "";
  const sort = url.searchParams.get("sort") ?? "desc";

  const allUsers = await prisma.user.findMany({
    where: {
      username: { contains: search, mode: "insensitive" },
    },
    select: {
      id: true,
      username: true,
      images: { select: { _count: { select: { ImageReport: true } } } },
    },
  });

  const withCount = allUsers.map((u) => ({
    id: u.id,
    username: u.username,
    reports: u.images.reduce((a, img) => a + img._count.ImageReport, 0),
  }));

  withCount.sort((a, b) =>
    sort === "asc" ? a.reports - b.reports : b.reports - a.reports,
  );

  const count = withCount.length;
  const users = withCount.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return { count, users, page, search, sort };
}

export default function AdminUsers() {
  const { count, users, page, search, sort } = useLoaderData<typeof loader>();

  return (
    <>
      <Form method="get" className="mb-4 flex items-end gap-2">
        <Input
          type="text"
          name="search"
          placeholder="Search by name"
          defaultValue={search}
        />
        <Select name="sort" defaultValue={sort}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Most Reports</SelectItem>
            <SelectItem value="asc">Least Reports</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit">Apply</Button>
      </Form>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>There are {count} users</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">User</TableHead>
                <TableHead>Reports</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.username}
                    </TableCell>
                    <TableCell>{user.reports}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/admin/user/${user.id}`}>
                        <Button variant={"outline-solid"}>Profile</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Pagination
        path="/admin/users"
        currentPage={page}
        totalCount={count}
        query={`search=${search}&sort=${sort}`}
      />
    </>
  );
}
