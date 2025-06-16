import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useFetcher } from "@remix-run/react";
import prettyBytes from "pretty-bytes";
import { useMemo, useState } from "react";

import { useToast } from "~/components/toast";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { prisma } from "~/services/database.server";
import { uploadToS3 } from "~/services/s3.server";
import { getSession, getUserBySession } from "~/services/session.server";

import { useAppLoaderData } from "./_app";
import {
  Segment,
  SegmentedProgressBar,
} from "~/components/segmented-progress-bar";

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) return redirect("/login");

  const user = await getUserBySession(session);
  const formData = await request.formData();
  const type = formData.get("type");
  let updated = false;

  if (type === "update_username") {
    const username = formData.get("username");
    if (typeof username === "string" && username.length > 0) {
      const changedAt = Date.parse(
        user!.username_changed_at as unknown as string,
      );
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      if (changedAt < sevenDaysAgo) {
        await prisma.user.update({
          where: { id: user!.id },
          data: {
            username,
            username_changed_at: new Date(),
            username_history: JSON.stringify([
              username,
              ...JSON.parse(user!.username_history as unknown as string),
            ]),
          },
        });
        updated = true;
      }
    }
  }

  if (type === "update_avatar") {
    const file = formData.get("avatar");
    if (file && file instanceof File && file.size > 0) {
      const ext = file.type.split("/")[1] ?? "png";
      const key = `avatars/${user!.id}.${ext}`;
      const response = await uploadToS3(file, key);
      if (response?.$metadata.httpStatusCode === 200) {
        await prisma.user.update({
          where: { id: user!.id },
          data: { avatar_url: key },
        });
        updated = true;
      }
    }
  }

  const accept = request.headers.get("Accept") || "";
  if (accept.includes("application/json")) {
    return json({ ok: updated });
  }

  return redirect("/dashboard/settings");
}

export default function Settings() {
  const data = useAppLoaderData()!;
  const fetcher = useFetcher();
  const { showToast } = useToast();
  const [username, setUsername] = useState(data.user.username);
  const [editingUsername, setEditingUsername] = useState(false);

  const changedAt = Date.parse(data!.user.username_changed_at);
  const sevenDaysAgo = Date.parse(
    new Date(data!.now - 7 * 24 * 60 * 60 * 1000).toString(),
  );

  const canChange = changedAt < sevenDaysAgo;

  const usage = useMemo(() => {
    const totals = { png: 0, jpeg: 0, gif: 0, webp: 0, other: 0 };
    for (const img of data.user.images as Array<any>) {
      if (img.deleted_at) continue;
      switch (img.type) {
        case "image/png":
          totals.png += img.size;
          break;
        case "image/jpeg":
        case "image/jpg":
          totals.jpeg += img.size;
          break;
        case "image/gif":
          totals.gif += img.size;
          break;
        case "image/webp":
          totals.webp += img.size;
          break;
        default:
          totals.other += img.size;
      }
    }
    return totals;
  }, [data.user.images]);

  const segments: Segment[] = [
    { label: "PNG", value: usage.png, color: "bg-blue-500" },
    { label: "JPEG", value: usage.jpeg, color: "bg-yellow-500" },
    { label: "GIF", value: usage.gif, color: "bg-green-500" },
    { label: "WEBP", value: usage.webp, color: "bg-purple-500" },
  ];

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4"></CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Uploader Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4"></CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Storage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex flex-wrap gap-4">
                  {segments
                    .filter((s) => s.value > 0)
                    .map((seg) => (
                      <div
                        key={seg.label}
                        className="flex items-center space-x-1"
                      >
                        <span
                          className={`w-3 h-3 rounded-sm ${seg.color}`}
                        ></span>
                        <span className="text-xs">{seg.label}</span>
                      </div>
                    ))}
                </div>
                <span className="text-sm font-medium">
                  {prettyBytes(data.user.space_used)} of{" "}
                  {prettyBytes(data.user.max_space)} used
                </span>
              </div>
              <SegmentedProgressBar
                segments={segments}
                max={data.user.max_space}
              />
            </div>
            <div className="flex space-x-2">
              <Form
                method="post"
                action="/api/create-checkout-session?order=500mb"
              >
                <Button type="submit">+500MB (£0.49/month)</Button>
              </Form>
              <Form
                method="post"
                action="/api/create-checkout-session?order=1gb"
              >
                <Button type="submit">+1GB (£1.99/month)</Button>
              </Form>
              <Form
                method="post"
                action="/api/create-checkout-session?order=5gb"
              >
                <Button type="submit">+5GB (£3.99/month)</Button>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
