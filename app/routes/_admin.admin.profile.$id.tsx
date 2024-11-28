import { AvatarImage } from "@radix-ui/react-avatar";
import { SelectTrigger, SelectValue } from "@radix-ui/react-select";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { CalendarIcon } from "lucide-react";
import { z } from "zod";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
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
import { Select } from "~/components/ui/select";
import { prisma } from "~/services/database.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const user = await prisma.user.findFirst({
    where: { id: params.id },
    select: {
      username: true,
      created_at: true,
      badges: true,
      upload_preferences: true,
    },
  });

  if (user === null) return redirect("/admin/index");

  return { user };
}

export default function AdminProfile() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <>
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`}
                alt={user?.username}
              />
              <AvatarFallback>
                {user?.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold">{user?.username}</h1>
              <p className="text-sm text-muted-foreground">
                <CalendarIcon className="mr-1 inline-block h-4 w-4" />
                Joined {new Date(user!.created_at).toLocaleDateString()}
              </p>
              <div className="mt-2">
                {JSON.parse(user!.badges).map((badge: { text: string }) => (
                  <Badge className="mr-2">{badge.text}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mx-auto mb-8">
        <CardHeader>
          <CardTitle>Uploader Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <Input className="hidden" value={"update_embed"} name="type" />
            <Label htmlFor="embed_title">Title</Label>
            <Input
              className="my-2"
              name="embed_title"
              defaultValue={user.upload_preferences?.embed_title}
            />
            <div className="text-red-500 text-sm">
              {actionData?.fieldErrors.embed_title}
            </div>
            <Label htmlFor="embed_author">Author</Label>
            <Input
              className="my-2"
              name="embed_author"
              defaultValue={user.upload_preferences?.embed_author}
            />
            <div className="text-red-500 text-sm">
              {actionData?.fieldErrors.embed_author}
            </div>
            <Label htmlFor="embed_colour">Colour</Label>
            <Input
              className="my-2"
              name="embed_colour"
              defaultValue={user.upload_preferences?.embed_colour}
            />
            <div className="text-red-500 text-sm">
              {actionData?.fieldErrors.embed_colour}
            </div>
            <Button type="submit">Save</Button>
          </Form>
        </CardContent>
      </Card>

      <Card className="mb border-red-900">
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
          <div className="">
          <Button>
            Lock Account
          </Button>
          <Button className="ml-2">
            Purge Images
          </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

const embedUpdateSchema = z.object({
  embed_title: z.string(),
  embed_author: z.string(),
  embed_colour: z
    .string()
    .length(7, { message: "Must be 7 characters long" })
    .regex(/^#/, { message: "Must be a valid hex colour" }),
});

export async function action({ request, params }: ActionFunctionArgs) {
  const user = await prisma.user.findFirst({ where: { id: params.id } });
  if (user === null)
    return {
      undefined,
      formErrors: [],
      fieldErrors: {
        embed_title: "",
        embed_author: "",
        embed_colour: "",
      },
    };

  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  let result;

  const requestType = formData.get("type");
  formData.delete("type");

  if (requestType === "update_embed") {
    result = embedUpdateSchema.safeParse(payload);
    if (!result.success) {
      const error = result.error.flatten();
      return {
        payload,
        formErrors: error.formErrors,
        fieldErrors: error.fieldErrors,
      };
    }
    await prisma.uploaderPreferences.update({
      where: {
        userId: user!.id,
      },
      data: {
        embed_author: result.data.embed_author,
        embed_title: result.data.embed_title,
        embed_colour: result.data.embed_colour,
      },
    });
  }

  return null;
}
