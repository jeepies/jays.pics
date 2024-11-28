import { Form, Link, useLoaderData } from "@remix-run/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { prisma } from "~/services/database.server";
import prettyBytes from "pretty-bytes";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { z } from "zod";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("action");
  const value = url.searchParams.get("value")

  if(query !== null) {
    switch(query) {
      case "site_block_toggle":
        await prisma.site.update({
          where: {
            id: "",
          },
          data: {
            is_upload_blocked: (value === "true")
          }
        })
        break;
    }
  }

  const users = await prisma.user.count();
  const images = await prisma.image.count();
  const bytesUsed = (
    await prisma.image.findMany({ select: { size: true } })
  ).reduce((acc, val) => acc + val.size, 0);

  const imagesWithoutDeleted = await prisma.image.count({
    where: { deleted_at: null },
  });

  const announcement = await prisma.announcement.findMany({
    select: {
      content: true,
    },
    orderBy: {
      created_at: "desc",
    },
    take: 1,
  });

  const siteData = await prisma.site.findFirst();

  return { users, images, imagesWithoutDeleted, bytesUsed, announcement, siteData };
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

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <Input
              className="hidden"
              value={"update_annoucement"}
              name="type"
            />
            <Input
              className="mb-2"
              name="content"
              defaultValue={data.announcement[0].content}
            />
            <Button type="submit">Post</Button>
          </Form>
        </CardContent>
      </Card>

      <Card className="border-red-900">
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription className="text-red-700">
            <i>These actions can be catastrophic</i>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <Input className="hidden" value={"danger_zone"} name="type" />
          </Form>
          <div>
            <Link to={`?action=site_block_toggle&value=${!data.siteData?.is_upload_blocked}`}>
            <Button>{data.siteData?.is_upload_blocked ? "Unblock Uploads" : "Block Uploads"}</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

const announcementSchema = z.object({
  content: z
    .string({ required_error: "Content is required" })
    .min(1, { message: "Should be atleast one character" })
    .max(256, { message: "Should be 256 or less characters" }),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  let result;

  const requestType = formData.get("type");
  formData.delete("type");

  if (requestType === "update_annoucement") {
    result = announcementSchema.safeParse(payload);
    if (!result.success) {
      const error = result.error.flatten();
      return {
        payload,
        formErrors: error.formErrors,
        fieldErrors: error.fieldErrors,
      };
    }
    await prisma.announcement.create({
      data: {
        content: result.data.content,
      },
    });
  }
  return null;
}
