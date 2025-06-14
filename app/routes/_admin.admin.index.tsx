import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { prisma } from '~/services/database.server';
import { useAdminLoader } from './_admin';
import { ChartPoint } from '~/components/ui/simple-chart';
import { Clock, FileChartColumn, FileImage, Users } from 'lucide-react';
import prettyBytes from 'pretty-bytes';
import prettyMs from 'pretty-ms';

export async function loader({ request }: LoaderFunctionArgs) {
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

  const typeCounts = await prisma.$queryRaw<{ type: string; count: number }[]>`
    SELECT "type", COUNT(*)::int as count
    FROM "Image"
    WHERE "deleted_at" IS NULL
    GROUP BY "type"
    ORDER BY count DESC
    LIMIT 5`;

  const topUploaders = await prisma.$queryRaw<{ username: string; count: number }[]>`
    SELECT "User"."username", COUNT(*)::int as count
    FROM "Image"
    JOIN "User" ON "User"."id" = "Image"."uploader_id"
    WHERE "Image"."deleted_at" IS NULL
    GROUP BY "User"."username"
    ORDER BY count DESC
    LIMIT 5`;

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

  const storageDailyRaw = await prisma.$queryRaw<{ date: Date; count: number }[]>`
  SELECT DATE_TRUNC('day', "created_at") as date, SUM(size)::int as count
  FROM "Image"
  WHERE "created_at" >= ${startDate} AND "deleted_at" IS NULL
  GROUP BY date
  ORDER BY date`;

  const uptime = prettyMs(process.uptime() * 1000, { compact: true });

  const users = await prisma.user.count();
  const images = await prisma.image.count();
  const bytesUsed = prettyBytes((await prisma.image.findMany({ select: { size: true } })).reduce((acc, val) => acc + val.size, 0));

  return {
    usersDaily: fillMissing(usersDailyRaw),
    imagesDaily: fillMissing(imagesDailyRaw),
    storageDaily: fillMissing(storageDailyRaw),
    typeCounts,
    topUploaders,
    uptime,
    users,
    images,
    bytesUsed
  };
}

const COLORS = ['#e05cd9', '#8b5cf6', '#22d3ee', '#16a34a', '#f97316'];

export default function AdminIndex() {
  const { usersDaily, imagesDaily, typeCounts, topUploaders, storageDaily, uptime, users, images, bytesUsed } = useLoaderData<typeof loader>();
  useAdminLoader();

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>{uptime}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>{users}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
            <FileImage className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>{images}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Space used</CardTitle>
            <FileChartColumn className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>{bytesUsed}</CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Registrations (7d)</CardTitle>
          </CardHeader>
          <CardContent className="h-60">
            <ResponsiveContainer width="100%" height="100%" className="text-primary">
              <BarChart data={usersDaily} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickFormatter={(v) => new Date(v).getUTCDate().toString()} />
                <Tooltip labelFormatter={(v) => new Date(v).toLocaleDateString()} />
                <Bar dataKey="count" fill="currentColor" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Uploads (7d)</CardTitle>
          </CardHeader>
          <CardContent className="h-60">
            <ResponsiveContainer width="100%" height="100%" className="text-primary">
              <BarChart data={imagesDaily} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickFormatter={(v) => new Date(v).getUTCDate().toString()} />
                <Tooltip labelFormatter={(v) => new Date(v).toLocaleDateString()} />
                <Bar dataKey="count" fill="currentColor" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>File Types</CardTitle>
          </CardHeader>
          <CardContent className="h-60">
            <ResponsiveContainer width="100%" height="100%" className="text-primary">
              <PieChart>
                <Pie dataKey="count" data={typeCounts} cx="50%" cy="50%" outerRadius={80} label={(entry) => entry.type}>
                  {typeCounts.map((_, index) => (
                    <Cell key={`tc-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Uploaders</CardTitle>
          </CardHeader>
          <CardContent className="h-60">
            <ResponsiveContainer width="100%" height="100%" className="text-primary">
              <BarChart data={topUploaders} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="username" />
                <Tooltip />
                <Bar dataKey="count" fill="currentColor" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Storage Usage (7d)</CardTitle>
        </CardHeader>
        <CardContent className="h-60">
          <ResponsiveContainer width="100%" height="100%" className="text-primary">
            <LineChart data={storageDaily} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickFormatter={(v) => new Date(v).getUTCDate().toString()} />
              <Tooltip
                labelFormatter={(v) => new Date(v).toLocaleDateString()}
                formatter={(value: number) => prettyBytes(value)}
              />
              <Line type="monotone" dataKey="count" stroke="currentColor" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
