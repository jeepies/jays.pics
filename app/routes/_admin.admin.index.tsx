import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, Link, useLoaderData } from '@remix-run/react';
import prettyBytes from 'pretty-bytes';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { ChartPoint, SimpleBarChart } from '~/components/ui/simple-chart';
import { prisma } from '~/services/database.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get('action');
  const value = url.searchParams.get('value');

  if (query !== null) {
    switch (query) {
      case 'site_block_toggle':
        await prisma.site.update({
          where: {
            id: '',
          },
          data: {
            is_upload_blocked: value === 'true',
          },
        });
        break;
    }
  }

  const users = await prisma.user.count();
  const images = await prisma.image.count();
  const bytesUsed = (await prisma.image.findMany({ select: { size: true } })).reduce((acc, val) => acc + val.size, 0);

  const imagesWithoutDeleted = await prisma.image.count({
    where: { deleted_at: null },
  });

  const startDate = new Date();
  startDate.setUTCHours(0, 0, 0, 0);
  startDate.setUTCDate(startDate.getUTCDate() - 6);

  const usersDailyRaw = await prisma.$queryRaw<{ date: Date; count: number }[]>`
    SELECT DATE_TRUNC('day', "created_at") as date, COUNT(*)::int as count
    FROM "User"
    WHERE "created_at" >= ${startDate} AND "deleted_at" IS NULL
    GROUP BY date
    ORDER BY date`;

  const imagesDailyRaw = await prisma.$queryRaw<{ date: Date; count: number }[]>`
    SELECT DATE_TRUNC('day', "created_at") as date, COUNT(*)::int as count
    FROM "Image"
    WHERE "created_at" >= ${startDate} AND "deleted_at" IS NULL
    GROUP BY date
    ORDER BY date`;

  const imageReportsDailyRaw = await prisma.$queryRaw<{ date: Date; count: number }[]>`
    SELECT DATE_TRUNC('day', "created_at") as date, COUNT(*)::int as count
    FROM "ImageReport"
    WHERE "created_at" >= ${startDate}
    GROUP BY date
    ORDER BY date`;

  const commentReportsDailyRaw = await prisma.$queryRaw<{ date: Date; count: number }[]>`
    SELECT DATE_TRUNC('day', "created_at") as date, COUNT(*)::int as count
    FROM "CommentReport"
    WHERE "created_at" >= ${startDate}
    GROUP BY date
    ORDER BY date`;

  const combineReports: Record<string, number> = {};
  for (const r of imageReportsDailyRaw) {
    const key = r.date.toISOString().slice(0, 10);
    combineReports[key] = (combineReports[key] || 0) + r.count;
  }
  for (const r of commentReportsDailyRaw) {
    const key = r.date.toISOString().slice(0, 10);
    combineReports[key] = (combineReports[key] || 0) + r.count;
  }
  const reportsDailyRaw = Object.keys(combineReports).map((k) => ({
    date: new Date(k),
    count: combineReports[k],
  }));

  function fillMissing(src: { date: Date; count: number }[]): ChartPoint[] {
    const out: ChartPoint[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setUTCDate(startDate.getUTCDate() + i);
      const key = d.toISOString().slice(0, 10);
      const found = src.find((s) => s.date.toISOString().slice(0, 10) === key);
      out.push({ date: key, count: found ? found.count : 0 });
    }
    return out;
  }

  const usersDaily = fillMissing(usersDailyRaw);
  const imagesDaily = fillMissing(imagesDailyRaw);
  const reportsDaily = fillMissing(reportsDailyRaw);

  const announcement = await prisma.announcement.findMany({
    select: {
      content: true,
    },
    orderBy: {
      created_at: 'desc',
    },
    take: 1,
  });

  const siteData = await prisma.site.findFirst();

  return {
    users,
    images,
    imagesWithoutDeleted,
    bytesUsed,
    announcement,
    siteData,
    usersDaily,
    imagesDaily,
    reportsDaily,
  };
}

export default function AdminDashboard() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <Input className="hidden" value={'update_annoucement'} name="type" />
            <Input className="mb-2" name="content" defaultValue={data.announcement[0].content} />
            <Button type="submit">Post</Button>
          </Form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Registrations (7d)</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={data.usersDaily} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Uploads (7d)</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={data.imagesDaily} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reports (7d)</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={data.reportsDaily} />
          </CardContent>
        </Card>
      </div>

      <Card className="border-red-900">
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription className="text-red-700">
            <i>These actions can be catastrophic</i>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <Input className="hidden" value={'danger_zone'} name="type" />
          </Form>
          <div>
            <Link to={`?action=site_block_toggle&value=${!data.siteData?.is_upload_blocked}`}>
              <Button>{data.siteData?.is_upload_blocked ? 'Unblock Uploads' : 'Block Uploads'}</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

const announcementSchema = z.object({
  content: z
    .string({ required_error: 'Content is required' })
    .min(1, { message: 'Should be atleast one character' })
    .max(256, { message: 'Should be 256 or less characters' }),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  let result;

  const requestType = formData.get('type');
  formData.delete('type');

  if (requestType === 'update_annoucement') {
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
