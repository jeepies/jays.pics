import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useAppLoaderData } from "./_app";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Form } from "@remix-run/react";
import { Label } from "~/components/ui/label";
import { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { del } from "~/services/s3.server";

export default function UploadSettings() {
  const data = useAppLoaderData();

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
              <Label htmlFor="embed_author">Author</Label>
              <Input
                className="my-2"
                name="embed_author"
                defaultValue={data?.user.upload_preferences?.embed_author}
              />
              <Label htmlFor="embed_colour">Colour</Label>
              <Input
                className="my-2"
                name="embed_colour"
                defaultValue={data?.user.upload_preferences?.embed_colour}
              />
              <Button type="submit">
                Save
              </Button>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

const embedUpdateSchema = z.object({
  
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const payload = Object.entries(formData);

  // TODO based on payload.type, run schema parse and function to update settings.

  return null;
}