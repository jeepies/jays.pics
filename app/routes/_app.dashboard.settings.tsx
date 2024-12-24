import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Form, redirect } from "react-router-dom";
import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { z } from "zod";
import { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { prisma } from "~/services/database.server";
import {
  commitSession,
  destroySession,
  getSession,
  getUserBySession,
} from "~/services/session.server";
import { useLoaderData, useActionData } from "@remix-run/react";
import cuid from "cuid";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .regex(/^[a-z0-9_]+$/gim, "Invalid username")
    .min(3, { message: "Must be 3 or more characters" })
    .max(20, { message: "Must be 20 or less characters" })
    .optional(),
  email: z.string({ required_error: "Email is required" }).email().nullable(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) return redirect("/");

  const user = await getUserBySession(session);
  if (!user)
    return redirect("/", {
      headers: { "Set-Cookie": await destroySession(session) },
    });

  const discordAccount = await prisma.account.findFirst({
    where: {
      userId: user.id,
      provider: "discord",
    },
  });

  let discordProfile = null;
  if (discordAccount?.access_token) {
    const response = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${discordAccount.access_token}`,
      },
    });
    if (response.ok) {
      discordProfile = await response.json();
    }
  }

  return { user, discordProfile };
}

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) return redirect("/");

  const formData = await request.formData();
  const action = formData.get("action");
  const user = await getUserBySession(session);

  if (!user) return redirect("/");

  if (action === "updateProfile") {
    const username = formData.get("username") as string;
    const email = (formData.get("email") as string) || null;

    try {
      const updateData: any = {};

      if (username && username !== user.username) {
        const changedAt = new Date(user.username_changed_at).getTime();
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

        if (changedAt > sevenDaysAgo) {
          return { error: "Username can only be changed once every 7 days" };
        }

        const existingUser = await prisma.user.findUnique({
          where: { username },
        });

        if (existingUser && existingUser.id !== user.id) {
          return { error: "Username already taken" };
        }

        updateData.username = username;
        updateData.username_changed_at = new Date();
      }

      if (email !== user.email) {
        if (email) {
          const existingUser = await prisma.user.findUnique({
            where: { email },
          });

          if (existingUser && existingUser.id !== user.id) {
            return { error: "Email already in use" };
          }
        }
        updateData.email = email;
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });
        return { success: `Profile updated successfully` };
      }

      return { error: "No changes made" };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { error: error.errors[0].message };
      }
      return { error: "Failed to update profile" };
    }
  }
  if (action === "connectDiscord") {
    const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
    const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI!;
    const state = crypto.randomUUID();

    session.set("oauth_state", state);

    return redirect(
      `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&response_type=code&scope=identify%20email&state=${state}`,
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  }
  if (action === "unlinkDiscord") {
    try {
      await prisma.account.deleteMany({
        where: {
          userId: user.id,
          provider: "discord",
        },
      });

      return { success: "Discord account unlinked successfully" };
    } catch (error) {
      return { error: "Failed to unlink Discord account" };
    }
  }
  if (action === "regenerateUploadKey") {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        upload_key: cuid(),
      },
    });

    return { success: "Upload key regenerated successfully" };
  }

  return null;
};

export default function Settings() {
  const { user, discordProfile } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: user.username,
      email: user.email ?? "",
    },
  });
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const changedAt = new Date(user.username_changed_at).getTime();
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const canChangeUsername = changedAt < sevenDaysAgo;

  const handleEditToggle = (field: "username" | "email") => {
    if (field === "username") {
      setIsEditingUsername(!isEditingUsername);
    } else {
      setIsEditingEmail(!isEditingEmail);
    }
  };

  const handleSave = (field: "username" | "email") => {
    if (field === "username") {
      setIsEditingUsername(false);
    } else {
      setIsEditingEmail(false);
    }
    handleSubmit((data) => {
      // Your form submission logic here
    })();
  };

  const handleCancel = (field: "username" | "email") => {
    if (field === "username") {
      setValue("username", user.username);
      setIsEditingUsername(false);
    } else {
      setValue("email", user.email ?? "");
      setIsEditingEmail(false);
    }
  };

  const hasDiscordConnected = user.accounts?.some(
    (account: { provider: string }) => account.provider === "discord"
  );

  const handleDiscordLink = async () => {
    const form = document.createElement("form");
    form.method = "post";

    const actionInput = document.createElement("input");
    actionInput.type = "hidden";
    actionInput.name = "action";
    actionInput.value = "connectDiscord";

    form.appendChild(actionInput);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  const handleDiscordUnlink = async () => {
    if (!confirm("Are you sure you want to unlink your Discord account?")) {
      return;
    }

    const form = document.createElement("form");
    form.method = "post";

    const actionInput = document.createElement("input");
    actionInput.type = "hidden";
    actionInput.name = "action";
    actionInput.value = "unlinkDiscord";

    form.appendChild(actionInput);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          {actionData?.error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{actionData.error}</AlertDescription>
            </Alert>
          )}
          {actionData?.success && (
            <Alert className="mb-4">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{actionData.success}</AlertDescription>
            </Alert>
          )}
          <Form
            method="post"
            onSubmit={handleSubmit((data) => {})}
            className="space-y-4"
          >
            <input type="hidden" name="action" value="updateProfile" />
            <div>
              <Label htmlFor="username">Username:</Label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 flex items-center space-x-2">
                  <Input
                    id="username"
                    {...register("username")}
                    disabled={!isEditingUsername || !canChangeUsername}
                    className="flex-1"
                  />
                  {!isEditingUsername ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Edit username"
                      disabled={!canChangeUsername}
                      onClick={() => handleEditToggle("username")}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Save username"
                        onClick={() => handleSave("username")}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Cancel username edit"
                        onClick={() => handleCancel("username")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              {errors.username && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.username.message}
                </p>
              )}
              {!canChangeUsername && (
                <p className="text-sm text-muted-foreground mt-1">
                  Username can only be changed once every 7 days
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email:</Label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 flex items-center space-x-2">
                  <Input
                    id="email"
                    {...register("email")}
                    placeholder="Set your email..."
                    disabled={!isEditingEmail}
                    className="flex-1"
                  />
                  {!isEditingEmail ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Edit email"
                      onClick={() => handleEditToggle("email")}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Save email"
                        onClick={() => handleSave("email")}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Cancel email edit"
                        onClick={() => handleCancel("email")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Linked Accounts</CardTitle>
          <CardDescription>Manage your connected accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">Discord</h3>
                {hasDiscordConnected ? (
                  <div className="flex items-center space-x-4 p-4">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <img
                        src={`https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.png`}
                        alt={`${discordProfile.username}'s avatar`}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{discordProfile.username}</p>
                      <p className="text-sm text-muted-foreground">
                        User ID: {discordProfile.id}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Not connected</p>
                )}
              </div>
              <Button
                variant={discordProfile ? "destructive" : "default"}
                onClick={
                  discordProfile ? handleDiscordUnlink : handleDiscordLink
                }
              >
                {discordProfile ? "Unlink" : "Link"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-4">
            <input type="hidden" name="action" value="regenerateUploadKey" />
            <div>
              <Label htmlFor="uploadKey">Upload Key:</Label>
              <div className="relative w-full">
                <Input
                  id="uploadKey"
                  name="uploadKey"
                  type="text"
                  value={user.upload_key}
                  readOnly
                  className="w-full transition-all duration-300 blur-[4px] hover:blur-none focus:blur-none pr-24"
                />
              </div>
            </div>
            <Button type="submit">Regenerate Upload Key</Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
