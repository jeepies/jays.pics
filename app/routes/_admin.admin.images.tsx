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
  const count = await prisma.image.count();

  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const search = url.searchParams.get("search") ?? "";
  const sort = url.searchParams.get("sort") ?? "desc";

  const images = await prisma.image.findMany({
    where: {
      display_name: { contains: search, mode: "insensitive" },
    },
    select: {
      id: true,
      display_name: true,
      ImageReport: true,
    },
    orderBy: { ImageReport: { _count: sort === "asc" ? "asc" : "desc" } },
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  return { count, images, page, search, sort };
}

export default function AdminImages() {
  const { count, images, page, search, sort } = useLoaderData<typeof loader>();

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
          <CardTitle>Images</CardTitle>
          <CardDescription>There are {count} images</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Reports</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {images.map((image) => {
                return (
                  <TableRow key={image.id}>
                    <TableCell className="font-medium">
                      {image.display_name}
                    </TableCell>
                    <TableCell>{image.ImageReport.length}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/admin/image/${image.id}`}>
                        <Button variant={"outline-solid"}>Review</Button>
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
        path="/admin/images"
        currentPage={page}
        totalCount={count}
        query={`search=${search}&sort=${sort}`}
      />
    </>
  );
}
