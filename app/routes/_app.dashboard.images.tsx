import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

import { PAGE_SIZE, Pagination } from "~/components/pagination";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Chip } from "~/components/ui/chip";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { generateInvisibleURL } from "~/lib/utils";
import { prisma } from "~/services/database.server";
import {
  destroySession,
  getSession,
  getUserBySession,
} from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("userID")) return redirect("/");

  const user = await getUserBySession(session);

  if (user === null)
    return redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });

  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const search = url.searchParams.get("search") ?? "";
  const sort = url.searchParams.get("sort") ?? "desc";
  let tag = url.searchParams.get("tag") ?? "";

  if (tag == "none") tag = "";

  const tags = await prisma.tag.findMany({ where: { user_id: user.id } });

  const images = await prisma.image.findMany({
    where: {
      uploader_id: user.id,
      display_name: { contains: search, mode: "insensitive" },
      tags: tag ? { some: { tag_id: tag } } : undefined,
    },
    orderBy: { created_at: sort === "asc" ? "asc" : "desc" },
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
    include: { tags: { include: { tag: true } } },
  });
  const imageCount = await prisma.image.count({
    where: {
      uploader_id: user.id,
      display_name: { contains: search, mode: "insensitive" },
      tags: tag ? { some: { tag_id: tag } } : undefined,
    },
    orderBy: { created_at: sort === "asc" ? "asc" : "desc" },
  });

  const query = url.searchParams.get("generate_link");

  let clipboard;
  if (query !== null) {
    const urls = user.upload_preferences!.urls;
    let url;
    if (urls.length === 1) url = urls[0];
    else url = urls[Math.floor(Math.random() * urls.length)];

    const subdomains = user.upload_preferences?.subdomains as
      | Record<string, string>
      | undefined;
    const sub = subdomains?.[url];
    const domain = sub ? `${sub}.${url}` : url;
    const formedURL = `https://${domain}/i/${query}/`;
    let returnableURL = formedURL;

    if (user.upload_preferences?.domain_hack) {
      returnableURL = generateInvisibleURL(returnableURL);
    }

    clipboard = returnableURL;
  }

  return { images, clipboard, page, imageCount, search, sort, tags, tag };
}

export default function Images() {
  const { images, clipboard, page, imageCount, search, sort, tags, tag } =
    useLoaderData<typeof loader>();

  if (clipboard) {
    navigator.clipboard.writeText(clipboard);
    window.location.href = "/dashboard/images";
  }

  if (images.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2">
        <h1 className="text-5xl">Nothing here :(</h1>
        <p className="text-muted-foreground">
          <Link to="/dashboard/help" className="underline">
            View the help guides to learn more
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Form method="get" className="mb-4 flex items-end gap-2">
        <Input
          type="text"
          name="search"
          placeholder="Search by name"
          defaultValue={search}
        />
        <Select name="sort" defaultValue={sort}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest</SelectItem>
            <SelectItem value="asc">Oldest</SelectItem>
          </SelectContent>
        </Select>
        <Select name="tag" defaultValue={tag}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">All</SelectItem>
            {tags.map((tagItem) => (
              <SelectItem key={tagItem.id} value={tagItem.id}>
                {tagItem.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit">Apply</Button>
      </Form>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <Card key={image.id}>
            <CardContent className="p-2">
              <div className="aspect-square w-full rounded-md bg-muted overflow-hidden flex items-center justify-center">
                <img
                  src={`/i/${image.id}/thumbnail`}
                  alt={image.display_name}
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="mt-2 truncate text-sm font-medium hover:text-primary">
                <Link to={`/i/${image.id}`}>{image.display_name}</Link>
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(image.created_at).toLocaleDateString()}
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {image.tags.length > 0 ? (
                  <div>
                    {image.tags.map((tagLink) => (
                      <Badge key={tagLink.tag.id} className="px-1 py-0">
                        {tagLink.tag.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <Badge>Untagged</Badge>
                )}
              </div>
              <div className="mt-2 flex gap-2">
                <Button asChild size="sm" className="h-8 flex-1">
                  <Link to={`?generate_link=${image.id}`}>Link</Link>
                </Button>
                <Button
                  asChild
                  variant="destructive"
                  size="sm"
                  className="h-8 flex-1"
                >
                  <Link to={`/i/${image.id}/delete`}>Delete</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Pagination
        path="/dashboard/images"
        currentPage={page}
        totalCount={imageCount}
        query={`search=${search}&sort=${sort}&tag=${tag}`}
      />
    </div>
  );
}
