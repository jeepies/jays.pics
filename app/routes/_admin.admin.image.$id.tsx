import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import prettyBytes from "pretty-bytes";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { prisma } from "~/services/database.server";

import { useAdminLoader } from "./_admin";

export async function loader({ params }: LoaderFunctionArgs) {
  const image = await prisma.image.findFirst({
    where: { id: params.id },
    include: {
      uploader: { select: { id: true, username: true } },
      ImageReport: {
        select: {
          id: true,
          reason_type: true,
          detail: true,
          created_at: true,
          reporter: { select: { id: true, username: true } },
        },
      },
    },
  });
  if (!image) return redirect("/admin/images");
  return { image };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const type = formData.get("type");

  if (type === "rename_image") {
    const name = formData.get("display_name");
    if (typeof name === "string" && name.length > 0) {
      await prisma.image.update({
        where: { id: params.id },
        data: { display_name: name },
      });
    }
  } else if (type === "make_private") {
    await prisma.image.update({
      where: { id: params.id },
      data: { privacy: "PRIVATE" },
    });
  } else if (type === "soft_delete_image") {
    await prisma.image.delete({ where: { id: params.id } });
  }

  return redirect(`/admin/image/${params.id}`);
}

export default function AdminImage() {
  useAdminLoader();
  const { image } = useLoaderData<typeof loader>();
  const [blur, setBlur] = useState(true);

  return (
    <div className="space-y-4">
      <Card className="flex items-center justify-center">
        <CardContent className="p-4">
        <button
            type="button"
            onClick={() => setBlur((b) => !b)}
            onKeyDown={(e) => e.key === 'Enter' && setBlur((b) => !b)}
            className="p-0 border-0 bg-transparent"
          >
            <img
              src={`/i/${image.id}/raw`}
              alt={image.display_name}
              className={cn('max-h-[512px] max-w-full object-contain transition-all', blur ? 'blur-md cursor-pointer' : 'cursor-pointer')}
            />
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            <strong>Name:</strong> {image.display_name}
          </p>
          <p>
            <strong>Uploader:</strong>{" "}
            <a href={`/admin/profile/${image.uploader.id}`}>
              {image.uploader.username}
            </a>
          </p>
          <p>
            <strong>Uploaded IP:</strong> {image.uploader_ip ?? "unknown"}
          </p>
          <p>
            <strong>Type:</strong> {image.type}
          </p>
          <p>
            <strong>Size:</strong> {prettyBytes(image.size)}
          </p>
          <p>
            <strong>Report count:</strong> {image.ImageReport.length}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {image.ImageReport.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reports</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {image.ImageReport.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <a href={`/admin/profile/${report.reporter.id}`}>
                        {report.reporter.username}
                      </a>
                    </TableCell>
                    <TableCell>
                      {report.reason_type}
                      {report.detail ? ` - ${report.detail}` : ""}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Date(report.created_at).toLocaleDateString()} @{" "}
                      {new Date(report.created_at).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Form method="post" className="flex gap-2">
            <Input type="hidden" name="type" value="rename_image" />
            <Input
              name="display_name"
              defaultValue={image.display_name}
              className="flex-1"
            />
            <Button type="submit">Rename</Button>
          </Form>
          <Form method="post">
            <Input type="hidden" name="type" value="make_private" />
            <Button type="submit" variant="outline">
              Make Private
            </Button>
          </Form>
          <Form method="post">
            <Input type="hidden" name="type" value="soft_delete_image" />
            <Button type="submit" variant="destructive">
              Delete
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
