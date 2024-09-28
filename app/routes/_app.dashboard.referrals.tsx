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
    where: { referrer_id: user!.id },
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
  const { data, user } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Code</CardTitle>
          </CardHeader>
          <CardContent>
            <Input id="referral-code" value={user?.referral_code} readOnly />
            <Button onClick={copy} className="mt-2 w-full">
              Copy
            </Button>
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Your Referrals</CardTitle>
            <CardDescription>
              You have used {data.referrals.length} of {user?.referral_limit}{" "}
              referrals
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO render a table here that has Username (as a clickable link to profile) and Date*/}
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
                    <TableRow>
                      <TableCell className="font-medium">
                        <a href={`/profile/${referral.referred_id}`}>{referral.referred_id}</a>
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
