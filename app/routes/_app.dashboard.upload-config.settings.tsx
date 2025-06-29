import { EyeClosedIcon } from "@radix-ui/react-icons";
import { CloudUpload, Eye, Wrench } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useAppLoaderData } from "./_app";

export default function UploadSettings() {
  const data = useAppLoaderData()!;
  const [canSeeUploadKey, setCanSeeUploadKey] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Uploader Details</CardTitle>
          <CloudUpload className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-2">
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
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Configs</CardTitle>
          <Wrench className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-2">
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
    </div>
  );
}
