import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '~/components/ui/card';
import { getAllReferrals, getSession, getUserByID, getUserBySession } from '~/services/session.server';
import { Textarea } from '~/components/ui/textarea';
import { CalendarIcon, ImageIcon, UserIcon } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { prisma } from '~/services/database.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  if (params.id === 'me') return redirect(`/profile/${session.get('userID')}`);
  const id = params.id ?? session.get('userID');

  const user = await getUserByID(id);
  if (!user) return redirect(`/profile/${session.get('userID')}`);

  const viewer = session.has('userID')
    ? await getUserBySession(session)
    : { id: '', username: 'Guest', is_admin: false };

    if(!viewer) return redirect('/')

  const referrals = await getAllReferrals(user.referrer_profile!.id);

  const images = await prisma.image.findMany({ where: { uploader_id: id } });

  const pinnedImages = user.pinned_images.length
    ? await prisma.image.findMany({ where: { id: { in: user.pinned_images } } })
    : [];

  const comments = await prisma.comment.findMany({
    where: { receiver_id: id },
    orderBy: { created_at: 'desc' },
    select: {
      id: true,
      content: true,
      commenter_id: true,
      commenter: { select: { username: true } },
    },
  });

  return json({ user, viewer, referrals, images, pinnedImages, comments });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  if (!session.has('userID')) return redirect('/login');
  const user = await getUserBySession(session);

  const formData = await request.formData();
  const type = formData.get('type');

  if (type === 'create_comment') {
    const content = formData.get('content');
    if (typeof content === 'string' && content.length > 0) {
      await prisma.comment.create({
        data: {
          commenter_id: user!.id,
          receiver_id: params.id!,
          content,
          hidden: false,
          flagged: false,
        },
      });
    }
  }

  if (type === 'delete_comment') {
    const commentId = formData.get('comment_id');
    if (typeof commentId === 'string') {
      const comment = await prisma.comment.findFirst({
        where: { id: commentId },
        select: { commenter_id: true },
      });
      if (comment && (comment.commenter_id === user!.id || user!.is_admin)) {
        await prisma.comment.delete({ where: { id: commentId } });
      }
    }
  }

  if (type === 'add_pin') {
    const imageId = formData.get('image_id');
    if (typeof imageId === 'string' && user!.id === params.id) {
      await prisma.user.update({
        where: { id: user!.id },
        data: { pinned_images: { push: imageId } },
      });
    }
  }

  if (type === 'remove_pin') {
    const imageId = formData.get('image_id');
    if (typeof imageId === 'string' && user!.id === params.id) {
      const current = await prisma.user.findUnique({
        where: { id: user!.id },
        select: { pinned_images: true },
      });
      if (current) {
        await prisma.user.update({
          where: { id: user!.id },
          data: { pinned_images: { set: current.pinned_images.filter((i) => i !== imageId) } },
        });
      }
    }
  }

  return redirect(`/profile/${params.id}`);
}

export default function Profile() {
  const { user, viewer, referrals, images, comments, pinnedImages } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`}
                alt={user.username}
              />
              <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-sm text-muted-foreground">
                <CalendarIcon className="mr-1 inline-block h-4 w-4" />
                Joined {new Date(user.created_at).toLocaleDateString()}
              </p>
              <div className="mt-2">
                {JSON.parse(user.badges).map((badge: { text: string }) => (
                  <Badge className="mr-2">{badge.text}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {pinnedImages.length > 0 && (
        <div className="my-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {pinnedImages.map((img) => (
            <div key={img.id} className="relative">
              <a href={`/i/${img.id}`} className="block aspect-square overflow-hidden bg-muted">
                <img src={`/i/${img.id}/raw`} className="object-cover w-full h-full" />
              </a>
              {viewer.id === user.id && (
                <Form method="POST" className="absolute top-1 right-1">
                  <Input type="hidden" name="type" value="remove_pin" />
                  <Input type="hidden" name="image_id" value={img.id} />
                  <Button variant="ghost" size="icon">
                    ✕
                  </Button>
                </Form>
              )}
            </div>
          ))}
        </div>
      )}

      {viewer.id === user.id && pinnedImages.length < 4 && (
        <Form method="POST" className="flex gap-2 mb-4">
          <Input type="hidden" name="type" value="add_pin" />
          <Input name="image_id" placeholder="Image ID" className="flex-1" />
          <Button type="submit" size="sm">
            Pin
          </Button>
        </Form>
      )}

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Comments ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                    <AvatarFallback>{c.commenter.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{c.commenter.username}</p>
                    <p className="text-muted-foreground break-words">{c.content}</p>
                  </div>
                  {viewer.id === c.commenter_id && (
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
        {viewer.id !== '' && (
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
  );
}
