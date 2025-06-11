import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';

import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { prisma } from '~/services/database.server';

import { useAdminLoader } from './_admin';


export async function loader({ request }: LoaderFunctionArgs) {
  const count = await prisma.imageReport.count();

  const images = await prisma.image.findMany({
    where: {
      ImageReport: {
        some: {},
      },
    },
    select: {
      id: true,
      display_name: true,
      created_at: true,
      uploader: {
        select: {
          id: true,
          username: true,
        },
      },
      ImageReport: {
        select: {
          id: true,
          reason_type: true,
          detail: true,
          created_at: true,
          reporter: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
  });

  return { count, images };
}

export default function Images() {
  useAdminLoader();
  const { count, images } = useLoaderData<typeof loader>();

  type LoaderData = Awaited<ReturnType<typeof loader>>;

  function ReportDialog({ image }: { image: LoaderData['images'][number] }) {
    const [open, setOpen] = useState(false);
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="px-2 py-1 text-xs">
            {image.ImageReport.length} {image.ImageReport.length === 1 ? 'report' : 'reports'}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Reports for {image.display_name}</DialogTitle>
            <DialogDescription>
              Uploaded by{' '}
              <a href={`/admin/profile/${image.uploader.id}`}>{image.uploader.username}</a>
            </DialogDescription>
          </DialogHeader>
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
                    <a href={`/admin/profile/${report.reporter.id}`}>{report.reporter.username}</a>
                  </TableCell>
                  <TableCell>
                    {report.reason_type}
                    {report.detail ? ` - ${report.detail}` : ''}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Date(report.created_at).toLocaleDateString()} @ {new Date(report.created_at).toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Image Reports</CardTitle>
        <CardDescription>There are {count} reports</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-72">Image</TableHead>
              <TableHead>Uploader</TableHead>
              <TableHead className="text-right">Reports</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {images.map((image) => (
              <TableRow key={image.id}>
                <TableCell className="font-medium">
                  <a href={`/i/${image.id}`}>{image.display_name}</a>
                </TableCell>
                <TableCell>
                  <a href={`/admin/profile/${image.uploader.id}`}>{image.uploader.username}</a>
                </TableCell>
                <TableCell className="text-right">
                  <ReportDialog image={image} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}