import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useFetcher } from "@remix-run/react";
import prettyBytes from "pretty-bytes";
import { useMemo, useState } from "react";
import { z } from "zod";
import { FormError } from "~/services/auth.server";

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
import { ConfirmDialog } from "~/components/confirm-dialog";

import { useAppLoaderData } from "./_app";
import {
  Segment,
  SegmentedProgressBar,
} from "~/components/segmented-progress-bar";
import {
  Check,
  Container,
  Hammer,
  Pencil,
  TriangleAlert,
  UserPen,
  X,
} from "lucide-react";
import { sendChangeEmail } from "~/services/resend.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) return redirect("/login");

  const user = await getUserBySession(session);
  if (!user || !user.email) return redirect("/login");
  const formData = await request.formData();
  const type = formData.get("type");

  // Username update
  if (type === "update_username") {
    const usernameSchema = z
      .string()
      .min(3, "Must be 3 or more characters")
      .max(20, "Must be 20 or less characters")
      .regex(/^[a-z0-9_]+$/gim, "Invalid username");
    const usernameEntry = formData.get("username");
    const username = typeof usernameEntry === "string" ? usernameEntry : "";
    let fieldErrors: Record<string, string | undefined> = {};
    if (typeof username !== "string" || username.length === 0) {
      fieldErrors.username = "Username is required";
    } else {
      const result = usernameSchema.safeParse(username);
      if (!result.success) {
        fieldErrors.username = result.error.errors[0].message;
      } else {
        const changedAt = Date.parse(
          user.username_changed_at as unknown as string,
        );
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        if (changedAt >= sevenDaysAgo) {
          fieldErrors.username =
            "You can only change your username every 7 days.";
        } else if (await prisma.user.findFirst({ where: { username } })) {
          fieldErrors.username = "This username already exists";
        }
      }
    }
    if (Object.keys(fieldErrors).length > 0) {
      return json({ ok: false, fieldErrors }, { status: 400 });
    }
    await prisma.user.update({
      where: { id: user.id },
      data: {
        username: username,
        username_changed_at: new Date(),
        username_history: JSON.stringify([
          username,
          ...JSON.parse(user.username_history as unknown as string),
        ]),
      },
    });
    return json({ ok: true });
  }

  // Email update
  if (type === "update_email") {
    const emailSchema = z.string().email("Invalid email address");
    const emailEntry = formData.get("email");
    const email = typeof emailEntry === "string" ? emailEntry : "";
    let fieldErrors: Record<string, string | undefined> = {};
    if (email.length === 0) {
      fieldErrors.email = "Email is required";
    } else {
      const result = emailSchema.safeParse(email);
      if (!result.success) {
        fieldErrors.email = result.error.errors[0].message;
      } else if (user.email.toLowerCase() === email.toLowerCase()) {
        fieldErrors.email = "This is already your email.";
      } else if (
        await prisma.user.findFirst({ where: { email: email.toLowerCase() } })
      ) {
        fieldErrors.email = "This email is already in use.";
      }
    }
    if (Object.keys(fieldErrors).length > 0) {
      return json({ ok: false, fieldErrors }, { status: 400 });
    }
    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: (email || "").toLowerCase(),
        email_verified: false,
        last_login_at: new Date(),
      },
    });
    await sendChangeEmail(user.email.toLowerCase(), email.toLowerCase(), true);
    return json({ ok: true });
  }

  // Avatar update
  if (type === "update_avatar") {
    const fileEntry = formData.get("avatar");
    let fieldErrors: Record<string, string | undefined> = {};
    if (!fileEntry || !(fileEntry instanceof File) || fileEntry.size === 0) {
      fieldErrors.avatar = "Please select an image to upload.";
    }
    if (Object.keys(fieldErrors).length > 0) {
      return json({ ok: false, fieldErrors }, { status: 400 });
    }
    const file = fileEntry as File;
    const ext = file.type.split("/")[1] ?? "png";
    const key = `avatars/${user.id}.${ext}`;
    const response = await uploadToS3(file, key);
    if (response?.$metadata.httpStatusCode === 200) {
      await prisma.user.update({
        where: { id: user.id },
        data: { avatar_url: key },
      });
      return json({ ok: true });
    } else {
      return json(
        { ok: false, fieldErrors: { avatar: "Failed to upload avatar." } },
        { status: 500 },
      );
    }
  }

  return redirect("/dashboard/settings");
}

export default function Settings() {
  const data = useAppLoaderData()!;
  const fetcher = useFetcher();
  const purgeFetcher = useFetcher();
  const deleteFetcher = useFetcher();
  const { showToast } = useToast();
  const [username, setUsername] = useState(data.user.username);
  const [email, setEmail] = useState(
    data.user.email?.toLowerCase() ?? "Set your email",
  );
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);

  // Error helpers
  const fieldErrors: Record<string, string | undefined> =
    fetcher.data &&
    typeof fetcher.data === "object" &&
    "fieldErrors" in fetcher.data &&
    fetcher.data.fieldErrors
      ? (fetcher.data.fieldErrors as Record<string, string | undefined>)
      : {};

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
    { label: "PNG", value: usage.png, color: "bg-purple-500" },
    { label: "JPEG", value: usage.jpeg, color: "bg-yellow-500" },
    { label: "GIF", value: usage.gif, color: "bg-blue-500" },
    { label: "WEBP", value: usage.webp, color: "bg-green-500" },
  ];

  async function handleImageArchive() {
    showToast("Preparing download", "info");
    try {
      const res = await fetch("/api/image-archive");
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${data.user.username}-images.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } else {
        const j = await res
          .json()
          .catch(() => ({ message: "Failed to download" }));
        showToast(j.message ?? "Failed to download", "error");
      }
    } catch {
      showToast("Failed to download", "error");
    }
  }

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
                    {fieldErrors?.username && (
                      <div className="text-red-500 text-sm mt-1">
                        {fieldErrors.username}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </fetcher.Form>

            <fetcher.Form
              method="post"
              encType="multipart/form-data"
              className="space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                setEditingEmail(false);
                fetcher.submit(fd, {
                  method: "post",
                  encType: "multipart/form-data",
                });
                showToast(
                  "Email updated - check your email, including your spam folder.",
                  "info",
                );
              }}
            >
              <Input type="hidden" name="type" value="update_email" />
              <div className="flex space-x-2">
                <div className="flex-1 space-y-2">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center space-x-2 mt-1 w-full">
                      <Input
                        id="email"
                        name="email"
                        className="flex-1"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (e.target.value.length === 0) {
                            setEmail("Set your email");
                          }
                        }}
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
                              setEmail(data.user.email!);
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
                    {fieldErrors?.email && (
                      <div className="text-red-500 text-sm mt-1">
                        {fieldErrors.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </fetcher.Form>

            <fetcher.Form
              method="post"
              encType="multipart/form-data"
              className="space-y-2"
              onSubmit={(e) => {
                const fd = new FormData(e.currentTarget);
                if (
                  !(fd.get("avatar") instanceof File) ||
                  (fd.get("avatar") as File).size === 0
                ) {
                  showToast("Select an image to upload", "error");
                  e.preventDefault();
                  return;
                }
                fetcher.submit(fd, {
                  method: "post",
                  encType: "multipart/form-data",
                });
                showToast("Avatar updated", "success");
                e.preventDefault();
              }}
            >
              <div className="flex space-x-2">
                <div className="flex-1 space-y-2">
                  <div>
                    <Input type="hidden" name="type" value="update_avatar" />
                    <Label htmlFor="avatar">Profile Picture</Label>
                    <div className="flex items-center space-x-2 mt-1 w-full">
                      <Input
                        id="avatar"
                        name="avatar"
                        type="file"
                        accept="image/*"
                        className="my-1"
                      />
                      <Button type="submit" variant="ghost" size="icon">
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                    {fieldErrors?.avatar && (
                      <div className="text-red-500 text-sm mt-1">
                        {fieldErrors.avatar}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </fetcher.Form>
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
                  {segments.map((seg) => (
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
            <div className="md:flex md:space-x-2 space-y-2 md:space-y-0">
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
            {data.user.StorageSubscription.length > 0 && (
              <div className="space-y-2 mt-4">
                <h4 className="font-medium">Active Subscriptions</h4>
                {data.user.StorageSubscription.map((sub) => (
                  <Form
                    key={sub.id}
                    method="post"
                    action={`/api/subscription/${sub.id}/cancel`}
                    className="flex items-center space-x-2"
                  >
                    <span>{prettyBytes(sub.storage)} plan</span>
                    <Button type="submit" variant="destructive">
                      Cancel
                    </Button>
                  </Form>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Actions</CardTitle>
            <Hammer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="md:flex md:space-x-2 md:space-y-0 space-y-2">
              <Button
                asChild
                onClick={() => showToast("Preparing download", "info")}
              >
                <a href="/api/data-archive" download>
                  Download My Data
                </a>
              </Button>
              <Button type="button" onClick={handleImageArchive}>
                Download My Images
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
              <ConfirmDialog
                title="Purge images"
                description="Are you sure you want to delete all images? This action is irreversible."
                onConfirm={() => {
                  purgeFetcher.submit(null, {
                    method: "post",
                    action: "/account/purge-images",
                  });
                  showToast("Images purged", "success");
                }}
                trigger={<Button variant="destructive">Delete images</Button>}
              />
              <ConfirmDialog
                title="Delete account"
                description="Delete your account and all images? This action cannot be undone."
                onConfirm={() => {
                  deleteFetcher.submit(null, {
                    method: "post",
                    action: "/account/delete",
                  });
                  showToast("Account deleted", "success");
                }}
                trigger={<Button variant="destructive">Delete account</Button>}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
