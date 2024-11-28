import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function Help() {
  const [reportingActiveTab, setReportingActiveTab] = useState("images");
  const [uploadingActiveTab, setUploadingActiveTab] = useState("onsite");

  return (
    <div className="container mx-auto px-4 py-8">
      <p>Uploading</p>
      <Tabs
        value={uploadingActiveTab}
        onValueChange={setUploadingActiveTab}
        className="mt-8"
      >
        <TabsList>
          <TabsTrigger value="onsite">On-site</TabsTrigger>
          <TabsTrigger value="sharex">ShareX</TabsTrigger>
        </TabsList>
        <TabsContent value="onsite" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>On-Site</CardTitle>
              <CardDescription>
                How to upload images to jays.pics on-site
              </CardDescription>
            </CardHeader>
            <CardContent>
              1. Navigate to the dashboard
              <br/>
              2. Click on the 'Upload New Image' button
              <br/>
              3. Select a file to upload
              <br/>
              4. Click upload
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sharex" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>ShareX</CardTitle>
              <CardDescription>
                How to set up ShareX to automatically upload to jays.pics
              </CardDescription>
            </CardHeader>
            <CardContent>
              1. Download your ShareX config
              <br/>
              2. Double click the file to open it with ShareX
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* <p className="my-8">Reporting content</p>
      <Tabs value={reportingActiveTab} onValueChange={setReportingActiveTab}>
        <TabsList>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>
        <TabsContent value="images" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>How to report uploaded images</CardDescription>
            </CardHeader>
            <CardContent>1. click a funny button</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="comments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
              <CardDescription>
                How to report comments on profile or images
              </CardDescription>
            </CardHeader>
            <CardContent>
              1. do this 2. do that 3. upload images 4. profit?
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs> */}
    </div>
  );
}
