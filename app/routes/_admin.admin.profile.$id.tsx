import { AvatarImage } from '@radix-ui/react-avatar';
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { CalendarIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { prisma } from '~/services/database.server';

export async function loader({ params }: LoaderFunctionArgs) {
  const user = await prisma.user.findFirst({
    where: { id: params.id },
    select: {
      username: true,
      created_at: true,
      badges: true,
      upload_preferences: true,
    },
  });

  if (user === null) return redirect('/admin/index');

  const images = await prisma.image.findMany({
    where: { uploader_id: params.id },
    select: {
      id: true,
      display_name: true,
      created_at: true,
    },
    orderBy: { created_at: 'desc' },
  });

  return { user, images };
}

export default function AdminProfile() {
  const { user, images } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [templates, setTemplates] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/get-templates')
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setTemplates(Object.keys(d.data));
      })
      .catch(() => {});
  }, []);

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
              <AvatarFallback>{user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
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

      <Card className="mx-auto mb-8">
        <CardHeader>
          <CardTitle>Uploader Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <Input className="hidden" value={'update_embed'} name="type" />
            <Label htmlFor="embed_title">Title</Label>
            <Input
              className="my-2"
              name="embed_title"
              defaultValue={user.upload_preferences?.embed_title}
              list="embed-templates"
            />
            <div className="text-red-500 text-sm">{actionData?.fieldErrors.embed_title}</div>
            <Label htmlFor="embed_author">Author</Label>
            <Input
              className="my-2"
              name="embed_author"
              defaultValue={user.upload_preferences?.embed_author}
              list="embed-templates"
            />
            <div className="text-red-500 text-sm">{actionData?.fieldErrors.embed_author}</div>
            <Label htmlFor="embed_colour">Colour</Label>
            <Input className="my-2" name="embed_colour" defaultValue={user.upload_preferences?.embed_colour} />
            <datalist id="embed-templates">
              {templates.map((t) => (
                <option key={t} value={`{{${t}}}`} />
              ))}
            </datalist>
            <div className="text-red-500 text-sm">{actionData?.fieldErrors.embed_colour}</div>
            <Button type="submit">Save</Button>
          </Form>
        </CardContent>
      </Card>

      <Card className="mb-8 border-red-900 ">
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription className="text-red-700">
            <i>These actions can be catastrophic</i>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <Input className="hidden" value={'danger_zone'} name="type" />
          </Form>
          <div className="">
            <Button>Lock Account</Button>
            <Button className="ml-2">Purge Images</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form method="post" className="flex gap-2">
            <Input type="hidden" name="type" value="force_username" />
            <Input name="username" defaultValue={user.username} className="flex-1" />
            <Button type="submit">Update Username</Button>
          </Form>

          <div>
            <h3 className="font-medium">Tags</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {JSON.parse(user.badges).map((badge: any, idx: number) => (
                <Form method="post" key={idx} className="flex items-center gap-1">
                  <Input type="hidden" name="type" value="remove_badge" />
                  <Input type="hidden" name="index" value={idx.toString()} />
                  <Badge style={{ backgroundColor: badge.colour ?? undefined }} className="mr-1">
                    {badge.text}
                  </Badge>
                  <Button type="submit" size="sm" variant="ghost">
                    ✕
                  </Button>
                </Form>
              ))}
            </div>
            <Form method="post" className="mt-2 flex gap-2">
              <Input type="hidden" name="type" value="add_badge" />
              <Input name="text" placeholder="Text" className="flex-1" />
              <Input name="colour" placeholder="#ffffff" className="w-24" />
              <Button type="submit" size="sm">
                Add
              </Button>
            </Form>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Images</CardTitle>
          <CardDescription>Uploaded by this user</CardDescription>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <p className="text-sm text-muted-foreground">No images uploaded</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {images.map((image) => (
                <Card key={image.id}>
                  <CardContent className="p-2 space-y-2">
                    <img
                      src={`/i/${image.id}/raw`}
                      alt={image.display_name}
                      className="aspect-square w-full rounded-md object-cover"
                    />
                    <p className="truncate text-sm font-medium hover:text-primary">
                      <a href={`/i/${image.id}`}>{image.display_name}</a>
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(image.created_at).toLocaleDateString()}</p>
                    <Form method="post">
                      <Input type="hidden" name="type" value="soft_delete_image" />
                      <Input type="hidden" name="image_id" value={image.id} />
                      <Button type="submit" size="sm" variant="destructive" className="w-full">
                        Delete
                      </Button>
                    </Form>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

const embedUpdateSchema = z.object({
  embed_title: z.string(),
  embed_author: z.string(),
  embed_colour: z
    .string()
    .length(7, { message: 'Must be 7 characters long' })
    .regex(/^#/, { message: 'Must be a valid hex colour' }),
});

export async function action({ request, params }: ActionFunctionArgs) {
  const user = await prisma.user.findFirst({ where: { id: params.id } });
  if (user === null)
    return {
      undefined,
      formErrors: [],
      fieldErrors: {
        embed_title: '',
        embed_author: '',
        embed_colour: '',
      },
    };

  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  let result;

  const requestType = formData.get('type');
  formData.delete('type');

  if (requestType === 'update_embed') {
    result = embedUpdateSchema.safeParse(payload);
    if (!result.success) {
      const error = result.error.flatten();
      return {
        payload,
        formErrors: error.formErrors,
        fieldErrors: error.fieldErrors,
      };
    }
    await prisma.uploaderPreferences.update({
      where: {
        userId: user!.id,
      },
      data: {
        embed_author: result.data.embed_author,
        embed_title: result.data.embed_title,
        embed_colour: result.data.embed_colour,
      },
    });
    await prisma.notification.create({
      data: {
        receiver_id: user!.id,
        content: 'Your embed configuration was updated by an admin',
      },
    });
  } else if (requestType === 'force_username') {
    const username = formData.get('username');
    if (typeof username === 'string' && username.length > 0) {
      await prisma.user.update({
        where: { id: user!.id },
        data: {
          username,
          username_changed_at: new Date(),
          username_history: JSON.stringify([username, ...JSON.parse(user!.username_history as unknown as string)]),
        },
      });
      await prisma.notification.create({
        data: {
          receiver_id: user!.id,
          content: 'Your username was changed by an admin',
        },
      });
    }
    return null;
  } else if (requestType === 'add_badge') {
    const text = formData.get('text');
    const colour = formData.get('colour');
    if (typeof text === 'string' && typeof colour === 'string') {
      const badges = JSON.parse(user!.badges ?? '[]');
      badges.push({ text, colour });
      await prisma.user.update({
        where: { id: user!.id },
        data: { badges: JSON.stringify(badges) },
      });
    }
    return null;
  } else if (requestType === 'remove_badge') {
    const index = Number(formData.get('index'));
    const badges = JSON.parse(user!.badges ?? '[]');
    if (!isNaN(index)) {
      badges.splice(index, 1);
      await prisma.user.update({
        where: { id: user!.id },
        data: { badges: JSON.stringify(badges) },
      });
    }
    return null;
  } else if (requestType === 'soft_delete_image') {
    const imageId = formData.get('image_id');
    if (typeof imageId === 'string') {
      await prisma.image.delete({ where: { id: imageId } });
    }
    return null;
  }
}
