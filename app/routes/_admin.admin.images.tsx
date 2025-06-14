import { LoaderFunctionArgs } from '@remix-run/node';
import { Form, Link, useLoaderData } from '@remix-run/react';
import { Button } from '~/components/ui/button';

import { PAGE_SIZE, Pagination } from '~/components/pagination';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { prisma } from '~/services/database.server';
import { Input } from '~/components/ui/input';

export async function loader({ request }: LoaderFunctionArgs) {
  const count = await prisma.image.count();

  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;
  const search = url.searchParams.get('search') ?? '';

  const images = await prisma.image.findMany({
    where: {
      display_name: { contains: search, mode: 'insensitive'}
    },
    select: {
      id: true,
      display_name: true,
    },
    orderBy: { created_at: 'asc' },
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  return { count, images, page, search };
}

export default function AdminImages() {
  const { count, images, page, search } = useLoaderData<typeof loader>();

  return (
    <>
      <Form method="get" className="mb-4 flex items-end gap-2">
        <Input type="text" name="search" placeholder="Search by name" defaultValue={search} />
        <Button type="submit">Apply</Button>
      </Form>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Images</CardTitle>
          <CardDescription>There are {count} images</CardDescription>
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
              {images.map((image) => {
                return (
                  <TableRow>
                    <TableCell className="font-medium">{image.display_name}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/admin/image/${image.id}`}>
                        <Button variant={'outline'}>Review</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Pagination path="/admin/images" currentPage={page} totalCount={count} query={`search=${search}`} />
    </>
  );
}
