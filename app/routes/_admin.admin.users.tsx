import { LoaderFunctionArgs, redirect } from "@remix-run/node";
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useAdminLoader } from "./_admin";
import { prisma } from "~/services/database.server";
import { useLoaderData } from "@remix-run/react";
import prettyBytes from "pretty-bytes";

export async function loader({ request }: LoaderFunctionArgs) {
  const count = await prisma.user.count();
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      images: true,
      space_used: true,
      is_admin: true,
      created_at: true,
      donated_urls: true,
    }
  });

  return { count, users };
}

export default function Users() {
  const me = useAdminLoader();
  const { count, users } = useLoaderData<typeof loader>();

  return (
    <>
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
                <TableHead>Images Uploaded</TableHead>
                <TableHead>Donated Domains</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead className="text-right">Date of Creation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                return (
                  <TableRow>
                    <TableCell className="font-medium">
                      <a href={`/admin/profile/${user.id}`}>{user.username}</a>
                    </TableCell>
                    <TableCell>{user.images.filter((image) => image.deleted_at === null).length} ({prettyBytes(user.space_used)}, w/ deleted: {user.images.length})</TableCell>
                    <TableCell>{user.donated_urls.length}</TableCell>
                    <TableCell>{user.is_admin ? "Yes" : "No"}</TableCell>
                    <TableCell className="text-right">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
