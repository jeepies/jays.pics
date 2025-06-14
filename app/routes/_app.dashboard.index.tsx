import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { Ban, Link as LinkIcon, Plus, Upload } from 'lucide-react';
import prettyBytes from 'pretty-bytes';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Progress } from '~/components/ui/progress';
import { generateInvisibleURL } from '~/lib/utils';
import { prisma } from '~/services/database.server';
import { destroySession, getAllReferrals, getSession, getUserBySession } from '~/services/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  if (!session.has('userID')) return redirect('/');

  const user = await getUserBySession(session);

  if (user === null)
    return redirect('/', {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    });

  const referrals = await getAllReferrals(user!.referrer_profile!.id);

  const images = await prisma.image.findMany({
    where: { uploader_id: user.id },
  });

  const announcement = await prisma.announcement.findMany({
    select: {
      content: true,
    },
    orderBy: {
      created_at: 'desc',
    },
    take: 1,
  });

  const siteData = await prisma.site.findFirst();

  const url = new URL(request.url);
  const query = url.searchParams.get('generate_link');

  let clipboard;
  if (query !== null) {
    const urls = user.upload_preferences!.urls;
    let url;
    if (urls.length === 1) url = urls[0];
    else url = urls[Math.floor(Math.random() * urls.length)];
    const subdomains = user.upload_preferences?.subdomains as Record<string, string> | undefined;
    const sub = subdomains?.[url];
    const domain = sub ? `${sub}.${url}` : url;
    const formedURL = `https://${domain}/i/${query}/`;
    let returnableURL = formedURL;

    if (user.upload_preferences?.domain_hack) {
      returnableURL = generateInvisibleURL(returnableURL);
    }

    clipboard = returnableURL;
  }

  return { user, referrals, images, announcement, siteData, clipboard };
}

export default function Dashboard() {
  const { user, referrals, images, announcement, siteData, clipboard } = useLoaderData<typeof loader>();

  if (clipboard) {
    navigator.clipboard.writeText(clipboard);
    window.location.href = '/dashboard/index';
  }

  const [totalStorage, setTotalStorage] = useState(0);
  const [storageLimit] = useState(user.max_space);

  useEffect(() => {
    const calculatedStorage = images.reduce((acc, image) => acc + image.size, 0);
    setTotalStorage(calculatedStorage);
  }, [user.images]);

  return (
    <div className="flex h-screen">
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold py-2">
          Welcome, <span className="text-primary">{user.username}</span>!
        </h1>

        <Card className="my-6">
          <CardHeader>
            <CardTitle>Announcement</CardTitle>
          </CardHeader>
          <CardContent>
            <Markdown>{announcement[0].content}</Markdown>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Images</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                <path d="M3 5v14a2 2 0 0 0 2 2h16" />
                <path d="m18 15 3 3-3 3" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{images.length}</div>
              <p className="text-xs text-muted-foreground">Lifetime uploads</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{prettyBytes(totalStorage)}</div>
              <Progress value={(totalStorage / storageLimit) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {((totalStorage / storageLimit) * 100).toFixed(2)}% of {" "}
                {prettyBytes(storageLimit)} limit
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Referrals</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{referrals.length}</div>
              <p className="text-xs text-muted-foreground">Total referrals</p>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Recent Uploads</h2>
          {siteData?.is_upload_blocked ? (
            <Button className="bg-destructive hover:bg-destructive text-destructive-foreground">
              <Ban className="mr-2 h-4 w-4" />
              Uploading Disabled
            </Button>
          ) : (
            <Button asChild>
              <Link to="/dashboard/upload">
                <Upload className="mr-2 h-4 w-4" /> Upload New Image
              </Link>
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images
            .slice(Math.max(images.length - 15, 0))
            .reverse()
            .map((image) => {
              return (
                <Card key={image.id}>
                  <CardContent className="p-2">
                    <img src={`/i/${image.id}/raw`} alt="Image" className="w-full h-24 object-cover rounded-md" />
                    <p className="mt-2 text-sm font-medium truncate">
                      <a href={`/i/${image.id}`}>{image.display_name}</a>
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(image.created_at).toLocaleDateString()}</p>
                    <Link to={`?generate_link=${image.id}`}>
                      <LinkIcon className="text-sm"></LinkIcon>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
        </div>
        <Button asChild className="mt-6" variant="outline">
          <Link to="/dashboard/images">
            <Plus className="mr-2 h-4 w-4" /> View All Images
          </Link>
        </Button>
      </main>
    </div>
  );
}
