import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import {
  getAllReferrals,
  getSession,
  getUserByID,
} from "~/services/session.server";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { CalendarIcon, ImageIcon, UserIcon } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { prisma } from "~/services/database.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (params.id === "me") return redirect(`/profile/${session.get("userID")}`);
  const id = params.id ?? session.get("userID");

  const user = await getUserByID(id);
  const referrals = await getAllReferrals(user!.referrer_profile!.id);

  if (!user) return redirect(`/profile/${session.get("userID")}`);
  // Who the fuck wrote this piece of shit???
  // fuck you @occorune that code does its job....

  const images = await prisma.image.findMany({ where: { uploader_id: id } });

  return { user, referrals, images };
}

export default function Profile() {
  const { user, referrals, images } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState("images");

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`}
                alt={user.username}
              />
              <AvatarFallback>
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-sm text-muted-foreground">
                <CalendarIcon className="mr-1 inline-block h-4 w-4" />
                Joined {new Date(user.created_at).toLocaleDateString()}
              </p>
              <div className="mt-2">
                {JSON.parse(user.badges).map((badge: { text: string }) => (
                  <Badge className="mr-2">{badge.text}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{images.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referrals</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referrals.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        <TabsContent value="images" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {images.map((image) => (
              <Card key={image.id}>
                <CardContent className="p-2">
                  <img
                    src={`/i/${image.id}/raw`}
                    alt="Image"
                    className="aspect-square w-full rounded-md object-cover"
                  />
                  <p className="mt-2 truncate text-sm font-medium">
                    <a href={`/i/${image.id}`}>{image.display_name}</a>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(image.created_at).toLocaleDateString()} at{" "}
                    {new Date(image.created_at).toLocaleTimeString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="about" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>About {user.username}</CardTitle>
              <CardDescription>
                More information about this user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                This user has been a member since{" "}
                {new Date(user.created_at).toLocaleDateString()}.
              </p>
              <p className="mt-2">
                They have uploaded {images.length} images and have{" "}
                {referrals.length} referral(s).
              </p>

              <Form method="POST" action="/profile/comment">
                <Input
                  id="target"
                  name="target"
                  type="text"
                  value={user.id}
                  required
                  className="hidden"
                />
                <Input
                  id="content"
                  name="content"
                  type="text"
                  placeholder="Comment"
                  required
                />
                <Button className="w-full" type="submit">
                  Comment
                </Button>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
