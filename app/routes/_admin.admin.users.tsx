import { LoaderFunctionArgs } from '@remix-run/node';
import { Form, Link, useLoaderData } from '@remix-run/react';
import { Button } from '~/components/ui/button';

import { PAGE_SIZE, Pagination } from '~/components/pagination';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { prisma } from '~/services/database.server';
import { Input } from '~/components/ui/input';

export async function loader({ request }: LoaderFunctionArgs) {
  const count = await prisma.user.count();

  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;
  const search = url.searchParams.get('search') ?? '';

  const users = await prisma.user.findMany({
    where: {
      username: { contains: search, mode: 'insensitive'}
    },
    select: {
      id: true,
      username: true,
    },
    orderBy: { created_at: 'asc' },
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  return { count, users, page, search };
}

export default function AdminUsers() {
  const { count, users, page, search } = useLoaderData<typeof loader>();

  return (
    <>
      <Form method="get" className="mb-4 flex items-end gap-2">
        <Input type="text" name="search" placeholder="Search by name" defaultValue={search} />
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
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                return (
                  <TableRow>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/admin/user/${user.id}`}>
                        <Button variant={'outline'}>Profile</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Pagination path="/admin/users" currentPage={page} totalCount={count} query={`search=${search}`} />
    </>
  );
}
