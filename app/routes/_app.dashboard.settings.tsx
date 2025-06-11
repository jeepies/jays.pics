import type { ActionFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { prisma } from '~/services/database.server';
import { uploadToS3 } from '~/services/s3.server';
import { getSession, getUserBySession } from '~/services/session.server';

import { useAppLoaderData } from './_app';

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  if (!session.has('userID')) return redirect('/login');

  const user = await getUserBySession(session);
  const formData = await request.formData();
  const type = formData.get('type');

  if (type === 'update_username') {
    const username = formData.get('username');
    if (typeof username === 'string' && username.length > 0) {
      const changedAt = Date.parse(user!.username_changed_at as unknown as string);
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      if (changedAt < sevenDaysAgo) {
        await prisma.user.update({
          where: { id: user!.id },
          data: {
            username,
            username_changed_at: new Date(),
            username_history: JSON.stringify([username, ...JSON.parse(user!.username_history as unknown as string)]),
          },
        });
      }
    }
  }

  return redirect('/dashboard/settings');
}

export default function Settings() {
  const data = useAppLoaderData()!;

  const changedAt = Date.parse(data!.user.username_changed_at);
  const sevenDaysAgo = Date.parse(new Date(data!.now - 7 * 24 * 60 * 60 * 1000).toString());

  const canChange = changedAt < sevenDaysAgo;

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form method="post" className="space-y-2">
              <Input type="hidden" name="type" value="update_username" />
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                defaultValue={data.user.username}
                readOnly={!canChange}
                className="my-1"
              />
              {!canChange && (
                <p className="text-sm text-muted-foreground">You can change your username every 7 days. Your last change was {new Date(changedAt).toLocaleDateString()}.</p>
              )}
              {canChange && <Button type="submit">Update Username</Button>}
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
