import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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
  TableCaption,
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

  const referrals = await prisma.referral.findMany({
    where: { referrer_id: user!.referrer_profile?.id },
    select: {
      created_at: true,
      referred: true,
    },
  });

  return await { data: { referrals: referrals }, user };
}

function copy() {
  const referralCode = document.getElementById("referral-code");
  // @ts-ignore
  referralCode.select();
  // @ts-ignore
  referralCode.setSelectionRange(0, 99999);
  // @ts-ignore
  navigator.clipboard.writeText(referralCode!.value);

  // TODO change button text to copied, then after an interval back to Copy
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
              value={user?.referrer_profile?.referral_code}
              readOnly
            />
            <Button onClick={copy} className="mt-2 w-full">
              Copy
            </Button>
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
