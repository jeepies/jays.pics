import { LoaderFunctionArgs, redirect } from "@remix-run/node";
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
import { useAdminLoader } from "./_admin";
import { prisma } from "~/services/database.server";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const count = await prisma.log.count();
  const logs = await prisma.log.findMany();

  return { count, logs };
}

export default function Users() {
  const me = useAdminLoader();
  const { count, logs } = useLoaderData<typeof loader>();

  return (
    <>
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Logs</CardTitle>
          <CardDescription>There are {count} logs</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="max-w-96">Message</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Date of Creation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).map((log) => {
                return (
                  <TableRow>
                    <TableCell className="font-medium">{log.message}</TableCell>
                    <TableCell>{log.type}</TableCell>
                    <TableCell className="text-right">
                      {new Date(log.created_at).toLocaleDateString()} @
                      {new Date(log.created_at).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
