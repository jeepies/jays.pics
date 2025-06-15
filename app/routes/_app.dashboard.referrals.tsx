import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { v4 } from "uuid";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { prisma } from "~/services/database.server";
import { getSession, getUserBySession } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = await getUserBySession(session);

  const url = new URL(request.url);
  const query = url.searchParams.get("regenerate");

  if (query !== null) {
    await prisma.referrerProfile.update({
      where: { userId: user!.id },
      data: {
        referral_code: v4(),
      },
    });
    return redirect("/dashboard/referrals");
  }

  const referrals = await prisma.referral.findMany({
    where: { referrer_id: user!.referrer_profile?.id },
    select: {
      created_at: true,
      referred: {
        select: {
          id: true,
          username: true,
        },
      }
    },
  });

  return await { data: { referrals: referrals }, user };
}

function copy(event: any) {
  const referralCode = document.getElementById("referral-code");
  const button = event.target;
  // @ts-ignore
  referralCode.select();
  // @ts-ignore
  referralCode.setSelectionRange(0, 99999);
  // @ts-ignore
  navigator.clipboard.writeText(referralCode!.value);

  button.innerText = "Copied";
  setTimeout(() => {
    button.innerText = "Copy";
  }, 1200);
}

export default function Referrals() {
  const { user, data } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Code</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              id="referral-code"
              className="text-center"
              value={user?.referrer_profile?.referral_code}
              readOnly
            />
            <Button id="copy-button" onClick={copy} className="mt-2 w-full">
              Copy
            </Button>
            <Link to="?regenerate">
              <Button className="mt-2 w-full">Regenerate</Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Your Referrals</CardTitle>
            <CardDescription>
              You have used {data.referrals.length} of{" "}
              {user?.referrer_profile?.referral_limit} referrals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">User</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.referrals.map((referral) => {
                  return (
                    <TableRow key={referral.referred.id}>
                      <TableCell className="font-medium">
                        <a href={`/profile/${referral.referred.id}`}>
                          {referral.referred.username}
                        </a>
                      </TableCell>
                      <TableCell className="text-right">
                        {new Date(referral.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
