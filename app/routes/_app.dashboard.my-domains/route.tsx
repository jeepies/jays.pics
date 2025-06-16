import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DataTable } from "~/components/ui/url-data-table";
import { Progress } from "~/lib/enums/progress";
import { prisma } from "~/services/database.server";
import { getSession, getUserBySession } from "~/services/session.server";

import { columns } from "./columns";
import { deleteZone } from "~/services/cloudflare.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUserBySession(
    await getSession(request.headers.get("Cookie")),
  );

  const urls = await prisma.uRL.findMany({
    where: {
      donator_id: user!.id,
    },
    select: {
      url: true,
      public: true,
      created_at: true,
      last_checked_at: true,
      progress: true,
    },
  });

  return urls;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const user = await getUserBySession(
    await getSession(request.headers.get("Cookie")),
  );
  const url = formData.get("url");
  const actionType = formData.get("action");
  const selected = formData.get("selected");

  if (typeof url === "string") {
    const domain = await prisma.uRL.findUnique({
      where: { url },
      select: { donator_id: true, progress: true },
    });

    if (
      !domain ||
      domain.donator_id !== user!.id ||
      domain.progress !== Progress.DONE
    ) {
      return redirect("/dashboard/my-domains");
    }

    if (actionType === "make_public") {
      await prisma.uRL.update({
        where: { url },
        data: { public: true },
      });
    }

    if (actionType === "make_private") {
      await prisma.uRL.update({
        where: { url },
        data: { public: false },
      });
    }

    if (actionType === "delete_selected" && typeof selected === "string") {
      const toDelete = Object.keys(JSON.parse(selected));
      const domains = await prisma.uRL.findMany({
        where: {
          url: { in: toDelete },
          donator_id: user!.id,
        },
        select: { url: true, zone_id: true },
      });

      for (const d of domains) {
        await prisma.uRL.delete({ where: { url: d.url } });
        await deleteZone(d.zone_id);

        const prefs = await prisma.uploaderPreferences.findMany({
          where: { urls: { has: d.url } },
          select: { userId: true, urls: true },
        });
        for (const pref of prefs) {
          await prisma.notification.create({
            data: {
              receiver_id: pref.userId,
              content: `Domain ${d.url} was removed`,
            },
          });
          await prisma.uploaderPreferences.update({
            where: { userId: pref.userId },
            data: { urls: pref.urls.filter((u: string) => u !== d.url) },
          });
        }
      }
    }
  }

  return redirect("/dashboard/my-domains");
}

export default function MyDomains() {
  const urls = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Domains</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <input type="hidden" name="action" value="delete_selected" />
            <DataTable columns={columns} data={urls} selected={[]} />
            <div className="mt-2 space-x-2">
              <Button type="button" asChild>
                <Link to="/dashboard/domain/add">Add Domain</Link>
              </Button>
              <Button type="submit" variant="destructive">
                Delete Domain(s)
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
