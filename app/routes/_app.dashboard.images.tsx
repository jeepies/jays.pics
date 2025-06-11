import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Form, Link, useLoaderData } from '@remix-run/react';
import { PAGE_SIZE, Pagination } from '~/components/pagination';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { generateInvisibleURL } from '~/lib/utils';
import { prisma } from '~/services/database.server';
import { destroySession, getSession, getUserBySession } from '~/services/session.server';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';

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

  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;
  const search = url.searchParams.get('search') ?? '';
  const sort = url.searchParams.get('sort') ?? 'desc';

  const images = await prisma.image.findMany({
    where: {
      uploader_id: user.id,
      display_name: { contains: search, mode: 'insensitive' },
    },
    orderBy: { created_at: sort === 'asc' ? 'asc' : 'desc' },
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });
  const imageCount = await prisma.image.count({
    where: {
      uploader_id: user.id,
      display_name: { contains: search, mode: 'insensitive' },
    },
    orderBy: { created_at: sort === 'asc' ? 'asc' : 'desc' },
  });

  const query = url.searchParams.get('generate_link');

  let clipboard;
  if (query !== null) {
    const urls = user.upload_preferences!.urls;
    let url;
    if (urls.length === 1) url = urls[0];
    else url = urls[Math.floor(Math.random() * urls.length)];

    const formedURL = `https://${url}/i/${query}/`;
    let returnableURL = formedURL;

    if (user.upload_preferences?.domain_hack) {
      returnableURL = generateInvisibleURL(returnableURL);
    }

    clipboard = returnableURL;
  }

  return { images, clipboard, page, imageCount, search, sort };
}

export default function Images() {
  const { images, clipboard, page, imageCount, search, sort } = useLoaderData<typeof loader>();

  if (clipboard) {
    navigator.clipboard.writeText(clipboard);
    window.location.href = '/dashboard/images';
  }

  if (images.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-5xl">Nothing here :(</h1>
      </div>
    );
    // TODO: Put text underneath linking to the help guides
  }

  return (
    <div className="p-4">
      <Form method="get" className="mb-4 flex items-end gap-2">
        <Input type="text" name="search" placeholder="Search by name" defaultValue={search} />
        <Select name="sort" defaultValue={sort}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest</SelectItem>
            <SelectItem value="asc">Oldest</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit">Apply</Button>
      </Form>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <Card key={image.id}>
            <CardContent className="p-2">
              <img
                src={`/i/${image.id}/raw`}
                alt={image.display_name}
                className="aspect-square w-full rounded-md object-cover"
              />
              <p className="mt-2 truncate text-sm font-medium hover:text-primary">
                <a href={`/i/${image.id}`}>{image.display_name}</a>
              </p>
              <p className="text-xs text-muted-foreground">{new Date(image.created_at).toLocaleDateString()}</p>
              <div className="mt-2 flex justify-between">
                <Link to={`?generate_link=${image.id}`}>
                  <Button size="sm">Link</Button>
                </Link>
                <Link to={`/i/${image.id}/delete`}>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Pagination
        path="/dashboard/images"
        currentPage={page}
        totalCount={imageCount}
        query={`search=${search}&sort=${sort}`}
      />
    </div>
  );
}
