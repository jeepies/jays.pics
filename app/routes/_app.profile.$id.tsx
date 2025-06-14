import { CommentReportReason } from '@prisma/client';
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { Form, useLoaderData, useFetcher } from '@remix-run/react';
import { CalendarIcon, ImageIcon } from 'lucide-react';
import { useState } from 'react';

import { ReportCommentDialog } from '~/components/report-comment-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { prisma } from '~/services/database.server';
import { getAllReferrals, getSession, getUserByID, getUserBySession } from '~/services/session.server';
import { useToast } from '~/components/toast';
import { ConfirmDialog } from '~/components/confirm-dialog';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  if (params.id === 'me') return redirect(`/profile/${session.get('userID')}`);
  const id = params.id ?? session.get('userID');

  const user = await getUserByID(id);
  if (!user) return redirect(`/profile/${session.get('userID')}`);

  const viewer = session.has('userID')
    ? await getUserBySession(session)
    : { id: '', username: 'Guest', is_admin: false };

  if (!viewer) return redirect('/');

  const referrals = await getAllReferrals(user.referrer_profile!.id);

  const images = await prisma.image.findMany({ where: { uploader_id: id } });

  const pinnedImagesRaw = user.pinned_images.length
    ? await prisma.image.findMany({ where: { id: { in: user.pinned_images } } })
    : [];
  const pinnedMap = new Map(pinnedImagesRaw.map((i) => [i.id, i]));
  const pinnedImages = user.pinned_images.slice(0, 4).map((id) => pinnedMap.get(id) ?? null);
  while (pinnedImages.length < 4) pinnedImages.push(null);

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
      if (comment && (comment.commenter_id === user!.id || user!.id === params.id || user!.is_admin)) {
        await prisma.comment.delete({ where: { id: commentId } });
      }
    }
  }

  if (type === 'report_comment') {
    const commentId = formData.get('comment_id');
    const reasonType = formData.get('reason_type');
    const detail = formData.get('detail');
    if (typeof commentId === 'string' && typeof reasonType === 'string') {
      await prisma.commentReport.create({
        data: {
          reporter_id: user!.id,
          comment_id: commentId,
          reason_type: reasonType as CommentReportReason,
          detail: typeof detail === 'string' ? detail : null,
        },
      });
    }
  }

  if (type === 'set_pin') {
    const imageId = formData.get('image_id');
    const indexStr = formData.get('index');
    if (typeof imageId === 'string' && typeof indexStr === 'string' && user!.id === params.id) {
      const index = parseInt(indexStr, 10);
      if (index >= 0 && index < 4) {
        const current = await prisma.user.findUnique({
          where: { id: user!.id },
          select: { pinned_images: true },
        });
        if (current) {
          const pins = current.pinned_images;
          pins[index] = imageId;
          await prisma.user.update({
            where: { id: user!.id },
            data: { pinned_images: { set: pins.slice(0, 4) } },
          });
        }
      }
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

  const accept = request.headers.get('Accept') || '';
  if (accept.includes('application/json')) {
    return json({ ok: true });
  }

  return redirect(`/profile/${params.id}`);
}

export default function Profile() {
  const { user, viewer, referrals, images, comments, pinnedImages } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const { showToast } = useToast();
  const [commentList, setCommentList] = useState(comments);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="">
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
                {JSON.parse(user.badges).map((badge: { text: string; colour: string }) => {
                  const colour = badge.colour ? `bg-[${badge.colour.toUpperCase()}]` : '';
                  return <Badge className={`mr-2 ${colour}`}>{badge.text}</Badge>;
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="my-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((idx) => {
          const img = pinnedImages[idx];
          return (
            <Card key={idx} className="relative overflow-hidden p-0">
              {img ? (
                <a href={`/i/${img.id}`} className="block aspect-square overflow-hidden bg-muted">
                  <div className="aspect-square w-full rounded-md bg-muted overflow-hidden flex items-center justify-center">
                    <img
                      src={`/i/${img.id}/thumbnail`}
                      alt={img.display_name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </a>
              ) : (
                <div className="flex aspect-square items-center justify-center border-2 border-dashed border-muted p-2">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              {viewer.id === user.id && (
                <>
                  <Form method="POST" className="absolute inset-0">
                    <Input type="hidden" name="type" value="set_pin" />
                    <Input type="hidden" name="index" value={idx.toString()} />
                    <select
                      title="select image"
                      name="image_id"
                      className="h-full w-full opacity-0 cursor-pointer"
                      onChange={(e) => e.currentTarget.form?.submit()}
                    >
                      <option value="">Select image</option>
                      {images.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.display_name}
                        </option>
                      ))}
                    </select>
                  </Form>
                  {img && (
                    <Form method="POST" className="absolute top-1 right-1">
                      <Input type="hidden" name="type" value="remove_pin" />
                      <Input type="hidden" name="image_id" value={img.id} />
                      <Button variant="ghost" size="icon">
                        ✕
                      </Button>
                    </Form>
                  )}
                </>
              )}
            </Card>
          );
        })}
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Comments ({commentList.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {commentList.length === 0 ? (
            <p className="text-sm text-muted-foreground">No comments yet</p>
          ) : (
            <div className="space-y-4">
              {commentList.map((c) => (
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
                  <div className="flex items-center space-x-1">
                    {(viewer.id === c.commenter_id || viewer.id === user.id || viewer.is_admin) && (
                      <ConfirmDialog
                        onConfirm={() => {
                          const fd = new FormData();
                          fd.append('type', 'delete_comment');
                          fd.append('comment_id', c.id);
                          fetcher.submit(fd, { method: 'post' });
                          setCommentList((prev) => prev.filter((cm) => cm.id !== c.id));
                          showToast('Comment deleted', 'success');
                        }}
                        trigger={
                          <Button variant="ghost" size="icon">
                            ✕
                          </Button>
                        }
                      />
                    )}
                    <ReportCommentDialog commentId={c.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        {viewer.id !== '' && (
          <CardFooter>
            <fetcher.Form
              method="POST"
              className="w-full space-y-2"
              onSubmit={(e) => {
                const form = e.currentTarget;
                const fd = new FormData(form);
                fetcher.submit(fd, { method: 'post' });
                const content = fd.get('content');
                if (typeof content === 'string' && content.length > 0) {
                  setCommentList((prev) => [
                    {
                      id: 'temp-' + Date.now(),
                      content,
                      commenter_id: viewer.id,
                      commenter: { username: viewer.username },
                    } as any,
                    ...prev,
                  ]);
                  showToast('Comment posted', 'success');
                  form.reset();
                }
                e.preventDefault();
              }}
            >
              <Input type="hidden" name="type" value="create_comment" />
              <Textarea name="content" placeholder="Add a comment" required />
              <Button type="submit" className="w-full">
                Post
              </Button>
            </fetcher.Form>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
