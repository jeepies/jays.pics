import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useAppLoaderData } from "./_app";

export default function Settings() {
  const data = useAppLoaderData()

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <label>
              Username:
            </label>
            <Input readOnly value={data?.user.username}/>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
