import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Form, MetaFunction, useLoaderData } from '@remix-run/react';
import prettyBytes from 'pretty-bytes';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Sidebar } from '~/components/ui/sidebar';
import { SidebarGuest } from '~/components/ui/sidebar-guest';
import { templateReplacer } from '~/lib/utils';
import { prisma } from '~/services/database.server';
import { getSession, getUserBySession } from '~/services/session.server';
import { ReportImageDialog } from '~/components/report-image-dialog';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const image = await prisma.image.findFirst({ where: { id: params.id } });
  if (!image) return redirect('/');
  const uploader = await prisma.user.findFirst({
    where: { id: image!.uploader_id },
    select: {
      username: true,
      upload_preferences: true,
      space_used: true,
      max_space: true,
    },
  });

  const comments = await prisma.imageComment.findMany({
    where: { image_id: params.id },
    orderBy: { created_at: 'desc' },
    select: {
      id: true,
      content: true,
      commenter_id: true,
      commenter: { select: { username: true } },
    },
  });

  const session = await getSession(request.headers.get('Cookie'));
  const user = session.has('userID') ? await getUserBySession(session) : { id: '', username: 'Guest', is_admin: false };

  return { data: { image: image, uploader: uploader }, user, comments };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  if (!session.has('userID')) return redirect(`/login`);
  const user = await getUserBySession(session);

  const formData = await request.formData();
  const type = formData.get('type');

  if (type === 'create_comment') {
    const content = formData.get('content');
    if (typeof content !== 'string' || content.length === 0) {
      return redirect(`/i/${params.id}`);
    }
    await prisma.imageComment.create({
      data: {
        commenter_id: user!.id,
        image_id: params.id!,
        content,
        hidden: false,
        flagged: false,
      },
    });
  }

  if (type === 'delete_comment') {
    const commentId = formData.get('comment_id');
    if (typeof commentId !== 'string') return redirect(`/i/${params.id}`);
    const comment = await prisma.imageComment.findFirst({
      where: { id: commentId },
      select: { commenter_id: true },
    });
    if (!comment) return redirect(`/i/${params.id}`);
    if (comment.commenter_id !== user!.id && !user!.is_admin)
      return redirect(`/i/${params.id}`);
    await prisma.imageComment.delete({ where: { id: commentId } });
  }

  if (type === 'report_image') {
    const reasonType = formData.get('reason_type');
    const detail = formData.get('detail');
    if (typeof reasonType !== 'string') return redirect(`/i/${params.id}`);
    await prisma.imageReport.create({
      data: {
        reporter_id: user!.id,
        image_id: params.id!,
        reason_type: reasonType,
        detail: typeof detail === 'string' ? detail : null,
      },
    });
  }


  return redirect(`/i/${params.id}`);
}

export default function Image() {
  const { data, user, comments } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen overflow-hidden">
      {user!.id !== '' ? (
        <Sidebar
          user={{ username: user!.username, is_admin: user!.is_admin, notifications: user!.notifications }}
          className="border-r"
        />
      ) : (
        <SidebarGuest className="border-r" />
      )}
      <div className="flex flex-1 overflow-auto p-4 gap-4">
        <div className="flex w-full max-w-md flex-col space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{data.image.display_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Uploaded by {data.uploader?.username}</p>
              <p>
                Uploaded on {new Date(data.image.created_at).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter>
            <ReportImageDialog imageId={data.image.id} />
              {/* <Button variant="destructive" className="w-full" asChild>
                <Link to="/dashboard/help">Report</Link>
              </Button> */}
            </CardFooter>
          </Card>

          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>Comments ({comments.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 overflow-auto">
              {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No comments yet</p>
              ) : (
                <div className="space-y-4">
                  {comments.map((c) => (
                    <div key={c.id} className="flex items-start space-x-2 text-sm">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${c.commenter.username}`}
                          alt={c.commenter.username}
                        />
                        <AvatarFallback>
                          {c.commenter.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{c.commenter.username}</p>
                        <p className="text-muted-foreground break-words">
                          {c.content}
                        </p>
                      </div>
                      {user!.id === c.commenter_id && (
                        <Form method="POST">
                          <Input type="hidden" name="type" value="delete_comment" />
                          <Input type="hidden" name="comment_id" value={c.id} />
                          <Button variant="ghost" size="icon">
                            ✕
                          </Button>
                        </Form>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            {user!.id !== '' && (
              <CardFooter>
                <Form method="POST" className="w-full space-y-2">
                  <Input type="hidden" name="type" value="create_comment" />
                  <Textarea name="content" placeholder="Add a comment" required />
                  <Button type="submit" className="w-full">
                    Post
                  </Button>
                </Form>
              </CardFooter>
            )}
          </Card>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="aspect-square w-full max-w-lg bg-muted flex items-center justify-center overflow-hidden">
            <img
              src={`/i/${data.image.id}/raw`}
              title={data.image.display_name}
              className="object-contain h-full w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [{ title: `Image | jays.pics ` }];

  const dictionary = {
    'image.name': data.data.image?.display_name,
    'image.size_bytes': data.data.image?.size,
    'image.size': prettyBytes(data.data.image!.size),
    'image.created_at': data.data.image?.created_at,

    'uploader.name': data.data.uploader?.username,
    'uploader.storage_used_bytes': data.data.uploader?.space_used,
    'uploader.storage_used': prettyBytes(data.data.uploader!.space_used),
    'uploader.total_storage_bytes': data.data.uploader?.max_space,
    'uploader.total_storage': prettyBytes(data.data.uploader!.max_space),
  };

  const title = templateReplacer(data.data.uploader?.upload_preferences?.embed_title ?? '', dictionary);

  return [
    { title: data.data.image?.display_name },
    { property: 'og:title', content: title },
    { property: 'og:description', content: '' },
    { property: 'og:type', content: 'website' },
    {
      property: 'og:url',
      content: `https://jays.pics/i/${data.data.image?.id}`,
    },
    {
      property: 'og:image',
      content: `https://jays.pics/i/${data.data.image?.id}/raw${data.data.image.type === 'image/gif' ? '.gif' : ''}`,
    },
    {
      name: 'theme-color',
      content: data.data.uploader?.upload_preferences?.embed_colour,
    },
    {
      tagName: 'link',
      type: 'application/json+oembed',
      href: `https://jays.pics/i/${data.data.image!.id}/oembed.json`,
    },
    { name: 'twitter:card', content: 'summary_large_image' },
  ];
};
