import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useAppLoaderData } from "./_app";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

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
            <br/>
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
            <label>Title:</label>
            <Input className="my-2" readOnly value={data?.user.upload_preferences?.embed_title} />
            <label>Author:</label>
            <Input className="my-2" readOnly value={data?.user.upload_preferences?.embed_author} />
            <label>Colour:</label>
            <Input className="my-2" readOnly value={data?.user.upload_preferences?.embed_colour} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
