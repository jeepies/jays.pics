import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useAppLoaderData } from "./_app";
import { Label } from "~/components/ui/label";

export default function Settings() {
  const data = useAppLoaderData();

  const changedAt = Date.parse(data!.user.username_changed_at)
  const sevenDaysAgo = Date.parse(new Date(data!.now - 7 * 24 * 60 * 60 * 1000).toString());
  
  const canChange = changedAt < sevenDaysAgo;

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <label>Username:</label>
            { canChange ? <Input defaultValue={data?.user.username} /> : <Input readOnly value={data?.user.username} />}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
