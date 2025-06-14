import type { ActionFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useFetcher } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { prisma } from '~/services/database.server';
import { uploadToS3 } from '~/services/s3.server';
import { getSession, getUserBySession } from '~/services/session.server';
import { useAppLoaderData } from './_app';
import { useToast } from '~/components/toast';
import { useState } from 'react';

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  if (!session.has('userID')) return redirect('/login');

  const user = await getUserBySession(session);
  const formData = await request.formData();
  const type = formData.get('type');
  let updated = false;


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
        updated = true;
      }
    }
  }

  if (type === 'update_avatar') {
    const file = formData.get('avatar');
    if (file && file instanceof File && file.size > 0) {
      const ext = file.type.split('/')[1] ?? 'png';
      const key = `avatars/${user!.id}.${ext}`;
      const response = await uploadToS3(file, key);
      if (response?.$metadata.httpStatusCode === 200) {
        await prisma.user.update({
          where: { id: user!.id },
          data: { avatar_url: key },
        });
        updated = true;
      }
    }
  }

  const accept = request.headers.get('Accept') || '';
  if (accept.includes('application/json')) {
    return json({ ok: updated });
  }

  return redirect('/dashboard/settings');
}

export default function Settings() {
  const data = useAppLoaderData()!;
  const fetcher = useFetcher();
  const { showToast } = useToast();
  const [username, setUsername] = useState(data.user.username);

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
          <fetcher.Form
              method="post"
              className="space-y-2"
              onSubmit={(e) => {
                const fd = new FormData(e.currentTarget);
                if (!canChange) {
                  showToast('You can change your username every 7 days', 'error');
                  e.preventDefault();
                  return;
                }
                const value = fd.get('username');
                if (typeof value === 'string') setUsername(value);
                showToast('Username updated', 'success');
                fetcher.submit(fd, { method: 'post' });
                e.preventDefault();
              }}
            >
              <Input type="hidden" name="type" value="update_username" />
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                readOnly={!canChange}
                className="my-1"
              />
              {!canChange && (
                <p className="text-sm text-muted-foreground">You can change your username every 7 days. Your last change was {new Date(changedAt).toLocaleDateString()}.</p>
              )}
              {canChange && <Button type="submit">Update Username</Button>}
              </fetcher.Form>
              <fetcher.Form
              method="post"
              encType="multipart/form-data"
              className="space-y-2"
              onSubmit={(e) => {
                const fd = new FormData(e.currentTarget);
                if (!(fd.get('avatar') instanceof File) || (fd.get('avatar') as File).size === 0) {
                  showToast('Select an image to upload', 'error');
                  e.preventDefault();
                  return;
                }
                showToast('Avatar updated', 'success');
                fetcher.submit(fd, { method: 'post', encType: 'multipart/form-data' });
                e.preventDefault();
              }}
            >
              <Input type="hidden" name="type" value="update_avatar" />
              <Label htmlFor="avatar">Profile Picture</Label>
              <Input id="avatar" name="avatar" type="file" accept="image/*" className="my-1" />
              <Button type="submit">Update Avatar</Button>
            </fetcher.Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
