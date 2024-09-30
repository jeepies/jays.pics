import { useLoaderData } from "@remix-run/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { prisma } from "~/services/database.server";
import prettyBytes from "pretty-bytes";

export async function loader() {
  const users = await prisma.user.count();
  const images = await prisma.image.count();
  const bytesUsed = (await prisma.image.findMany({ select: { size: true}})).reduce((acc, val) => acc + val.size, 0);

  const imagesWithoutDeleted = await prisma.image.count({
    where: { deleted_at: null },
  });

  return { users, images, imagesWithoutDeleted, bytesUsed };
}

export default function AdminDashboard() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.users}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.imagesWithoutDeleted} ({data.images} total)
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {prettyBytes(data.bytesUsed)}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
