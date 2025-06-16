import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useFetcher } from "@remix-run/react";
import prettyBytes from "pretty-bytes";
import { useMemo, useState } from "react";

import { useToast } from "~/components/toast";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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
import {
  Check,
  CloudUpload,
  Container,
  Eye,
  Hammer,
  Pencil,
  TriangleAlert,
  UserPen,
  X,
} from "lucide-react";
import { EyeClosedIcon } from "@radix-ui/react-icons";

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
  const [email, setEmail] = useState(data.user.email);
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [canSeeUploadKey, setCanSeeUploadKey] = useState(false);

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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Account Details</CardTitle>
            <UserPen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <fetcher.Form
              method="post"
              onSubmit={(e) => {
                e.preventDefault();
                if (username === data.user.username) {
                  setEditingUsername(false);
                  showToast("You can't change to the same username", "error");
                  return;
                }
                const fd = new FormData(e.currentTarget);
                fetcher.submit(fd, { method: "post" });
                setEditingUsername(false);
                showToast("Username updated", "success");
              }}
            >
              <Input type="hidden" name="type" value="update_username" />
              <div className="flex space-x-2">
                <div className="flex-1 space-y-2">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <div className="flex items-center space-x-2 mt-1 w-full">
                      <Input
                        id="username"
                        name="username"
                        className="flex-1"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        readOnly={!editingUsername}
                      />
                      {canChange &&
                        (editingUsername ? (
                          <>
                            <Button type="submit" variant="ghost" size="icon">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setUsername(data.user.username);
                                setEditingUsername(false);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingUsername(true)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </fetcher.Form>

            <fetcher.Form
              onSubmit={(e) => {
                e.preventDefault();
                setEditingEmail(false);
                showToast("Sorry - you can't do this yet!", "error");
                return;
              }}
            >
              <Input type="hidden" name="type" value="update_email" />
              <div className="flex space-x-2">
                <div className="flex-1 space-y-2">
                  <div>
                    <Label htmlFor="username">Email</Label>
                    <div className="flex items-center space-x-2 mt-1 w-full">
                      <Input
                        id="username"
                        name="username"
                        className="flex-1"
                        value={data.user.email ?? ""}
                        onChange={(e) => setEmail(e.target.value)}
                        readOnly={!editingEmail}
                      />
                      {editingEmail ? (
                        <>
                          <Button type="submit" variant="ghost" size="icon">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEmail(data.user.username);
                              setEditingEmail(false);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingEmail(true)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </fetcher.Form>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Uploader Details</CardTitle>
            <CloudUpload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <label>Upload Key:</label>
            <div className="flex space-x-2">
              <Input
                type={canSeeUploadKey ? "text" : "password"}
                readOnly
                value={data?.user.upload_key}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setCanSeeUploadKey(!canSeeUploadKey)}
              >
                {canSeeUploadKey ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeClosedIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button>
                <a href={`/api/sharex/${data?.user.id}`}>ShareX</a>
              </Button>
              <Button>
                <a href={`/api/sharenix/${data?.user.id}`}>ShareNix</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Storage</CardTitle>
            <Container className="h-4 w-4 text-muted-foreground" />
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

        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Actions</CardTitle>
            <Hammer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Button
                asChild
                onClick={() => showToast("Preparing download", "info")}
              >
                <a href="/api/data-archive" download>
                  Download My Data
                </a>
              </Button>
              <Button
                asChild
                onClick={() => showToast("Preparing download", "info")}
              >
                <a href="/api/image-archive" download>
                  Download My Images
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-900">
          <CardHeader>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Destructive Actions</CardTitle>
              <TriangleAlert className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription className="text-red-700">
              <i>These actions can be catastrophic</i>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Button variant="destructive">Purge images</Button>
              <Button variant="destructive">Delete account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
