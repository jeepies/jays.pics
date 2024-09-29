import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useAppLoaderData } from "./_app";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Form, useActionData } from "@remix-run/react";
import { Label } from "~/components/ui/label";
import { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { del } from "~/services/s3.server";
import { prisma } from "~/services/database.server";
import { getSession, getUserBySession } from "~/services/session.server";

export default function UploadSettings() {
  const data = useAppLoaderData();
  const actionData = useActionData<typeof action>();

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Uploader Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <label>Upload Key:</label>
            <Input className="my-2" readOnly value={data?.user.upload_key} />
            <label>Download Configs for:</label>
            <br />
            <Button>
              <a href={`/api/sharex/${data?.user.id}`}>ShareX</a>
            </Button>
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Embed Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Form method="post">
              <Input className="hidden" value={"update_embed"} name="type" />
              <Label htmlFor="embed_title">Title</Label>
              <Input
                className="my-2"
                name="embed_title"
                defaultValue={data?.user.upload_preferences?.embed_title}
              />
              <div className="text-red-500 text-sm">
                {actionData?.fieldErrors.embed_title}
              </div>
              <Label htmlFor="embed_author">Author</Label>
              <Input
                className="my-2"
                name="embed_author"
                defaultValue={data?.user.upload_preferences?.embed_author}
              />
              <div className="text-red-500 text-sm">
                {actionData?.fieldErrors.embed_author}
              </div>
              <Label htmlFor="embed_colour">Colour</Label>
              <Input
                className="my-2"
                name="embed_colour"
                defaultValue={data?.user.upload_preferences?.embed_colour}
              />
              <div className="text-red-500 text-sm">
                {actionData?.fieldErrors.embed_colour}
              </div>
              <Button type="submit">Save</Button>
            </Form>
          </CardContent>
        </Card>
      </div>
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

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  let result;

  const requestType = formData.get("type");
  formData.delete("type");
  
  const user = await getUserBySession(await getSession(request.headers.get("Cookie")));

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
        embed_colour: result.data.embed_colour
      }
    })
  }
  return null;
}
