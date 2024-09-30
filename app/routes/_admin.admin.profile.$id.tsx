import { AvatarImage } from "@radix-ui/react-avatar";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CalendarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardTitle } from "~/components/ui/card";
import { prisma } from "~/services/database.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const user = await prisma.user.findFirst({ where: { id: params.id } });

  if (user === null) return redirect("/admin/index");

  return { user };
}

export default function AdminProfile() {
  const { user } = useLoaderData<typeof loader>();

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

      <Card className="mx-auto px-4 py-8">
        <CardTitle>Actions</CardTitle>
        <CardContent></CardContent>
      </Card>
    </>
  );
}
