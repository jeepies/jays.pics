import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { z } from "zod";

import { useToast } from "~/components/toast";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { prisma } from "~/services/database.server";
import { getSession, getUserBySession } from "~/services/session.server";

import { useAppLoaderData } from "../_app";

const embedUpdateSchema = z.object({
  embed_title: z.string(),
  embed_author: z.string(),
  embed_colour: z
    .string()
    .length(7, { message: "Must be 7 characters long" })
    .regex(/^#/, { message: "Must be a valid hex colour" }),
  domain_hack: z.string().optional(),
});

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) return redirect("/login");

  const user = await getUserBySession(session);
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  const result = embedUpdateSchema.safeParse(payload);

  if (!result.success) {
    const error = result.error.flatten();
    console.log(error);
    return json({ ok: false, fieldErrors: error.fieldErrors }, { status: 400 });
  }

  await prisma.uploaderPreferences.update({
    where: { userId: user!.id },
    data: {
      embed_author: result.data.embed_author,
      embed_title: result.data.embed_title,
      embed_colour: result.data.embed_colour,
      domain_hack: result.data.domain_hack === "on",
    },
  });

  const accept = request.headers.get("Accept") || "";
  if (accept.includes("application/json")) {
    return json({ ok: true });
  }

  return redirect("/dashboard/embed");
}

export default function Embed() {
  const data = useAppLoaderData();
  const fetcher = useFetcher();
  const { showToast } = useToast();
  const [title, setTitle] = useState(
    data!.user.upload_preferences?.embed_title,
  );
  const [author, setAuthor] = useState(
    data!.user.upload_preferences?.embed_author,
  );
  const [colour, setColour] = useState(
    data!.user.upload_preferences?.embed_colour,
  );
  const [useDomainHack, setUseDomainHack] = useState(
    data!.user.upload_preferences?.domain_hack,
  );
  const [url, setUrl] = useState(
    useDomainHack
      ? "https://jays.pics/"
      : "https://jays.pics/i/cmbzo760j000fk5lbk3gr7hpg",
  );
  const [templates, setTemplates] = useState<Record<string, string>>({});
  const footer = "Hosted with 🩵 at jays.pics";

  const TEMPLATE_EXAMPLES: Record<string, string> = {
    "image.name": "Image.png",
    "image.size_bytes": "123456",
    "image.size": "120 KB",
    "image.created_at": "2025-01-01",
    "uploader.name": data!.user.username,
    "uploader.storage_used_bytes": "204800",
    "uploader.storage_used": "200 KB",
    "uploader.total_storage_bytes": "1048576",
    "uploader.total_storage": "1 MB",
  };

  function applyTemplates(text: string): string {
    return text.replace(
      /{{(.*?)}}/g,
      (_, key) => TEMPLATE_EXAMPLES[key.trim()] ?? `{{${key}}}`,
    );
  }

  useEffect(() => {
    fetch("/api/get-templates")
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setTemplates(d.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (useDomainHack) setUrl("https://jays.pics/");
    else setUrl("https://jays.pics/i/cmbzo760j000fk5lbk3gr7hpg");
  }, [useDomainHack]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Embed Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="w-full max-w-md bg-[#313338] rounded-lg p-0 border border-[#232428] shadow-md">
              <div className="flex items-center px-4 pt-4 pb-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      data!.user.avatar_url
                        ? `/avatar/${data!.user.id}`
                        : `https://api.dicebear.com/6.x/initials/svg?seed=${data!.user.username}`
                    }
                    alt={data!.user.username}
                  />
                  <AvatarFallback>
                    {data!.user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="ml-3 font-semibold text-white text-sm">
                  {data!.user.username}
                </span>
              </div>
              <div className="px-4 pb-2 text-blue-400 text-sm">{url}</div>
              <div
                className="flex flex-col bg-[#2b2d31] rounded-lg mx-4 mb-4 mt-1 border-l-4"
                style={{ borderLeftColor: colour }}
              >
                <div className="px-4 pt-3 pb-2">
                  {author && (
                    <div className="text-xs text-[#b5bac1] mb-1">
                      {applyTemplates(author)}
                    </div>
                  )}
                  {title && (
                    <div className="font-semibold text-white text-base mb-1">
                      {applyTemplates(title)}
                    </div>
                  )}
                  <div className="text-xs text-blue-400 mb-2 break-all">
                    {url}
                  </div>
                  <img
                    src="/logo.png"
                    alt="example"
                    className="mt-2 w-full rounded bg-[#232428] border border-[#232428]"
                  />
                  {/* {footer && ( @ TODO: Add footer editing in form
                    <div className="flex items-center mt-3 text-xs text-[#b5bac1]">
                      <img
                        src="/favicon.ico"
                        alt="icon"
                        className="w-4 h-4 mr-2 rounded"
                      />
                      {footer}
                    </div>
                  )} */}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <fetcher.Form
                method="post"
                onSubmit={(e) => {
                  const fd = new FormData(e.currentTarget);
                  fetcher.submit(fd, { method: "post" });
                  showToast("Embed settings saved", "success");
                  e.preventDefault();
                }}
              >
                <div>
                  <Label htmlFor="embed-title">Title</Label>
                  <Input
                    id="embed-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    list="embed-templates"
                    className="mt-1"
                    name="embed_title"
                  />
                </div>
                <div>
                  <Label htmlFor="embed-author">Author</Label>
                  <Input
                    id="embed-author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    list="embed-templates"
                    className="mt-1"
                    name="embed_author"
                  />
                </div>
                <div>
                  <Label htmlFor="embed-colour">Colour</Label>
                  <Input
                    id="embed-colour"
                    type="color"
                    value={colour}
                    onChange={(e) => setColour(e.target.value)}
                    className="mt-1 h-10 p-0"
                    name="embed_colour"
                  />
                </div>
                <div className="items-top flex space-x-2 my-2">
                  <Checkbox
                    name="domain_hack"
                    defaultChecked={data?.user.upload_preferences?.domain_hack}
                    onCheckedChange={(checked) => setUseDomainHack(!!checked)}
                  >
                    Invisible Extension
                  </Checkbox>
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms1"
                      className="text-sm font-medium leading-none pe er-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Discord: Invisible Path
                    </label>
                  </div>
                </div>
                <Button className="relative bottom-0 w-full" type="submit">
                  Save
                </Button>
              </fetcher.Form>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Available Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(templates).map(([key, desc]) => (
                <TableRow key={key}>
                  <TableCell className="font-mono">
                    {"{{" + key + "}}"}
                  </TableCell>
                  <TableCell>{desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
