import { Progress } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { prisma } from "~/services/database.server";
import { getSession, getUserBySession } from "~/services/session.server";

import { DataTable } from "../../components/ui/url-data-table";
import { useAppLoaderData } from "../_app";

import { getColumns, type URL } from "./columns";
import { TemplateInput } from "~/components/template-input";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUserBySession(
    await getSession(request.headers.get("Cookie"))
  );

  const public_domains = await prisma.uRL.findMany({
    where: {
      public: true,
      progress: Progress.DONE,
    },
    select: {
      url: true,
      donator: {
        select: {
          username: true,
        },
      },
    },
  });
  const private_domains = await prisma.uRL.findMany({
    where: {
      donator_id: user!.id,
      progress: Progress.DONE,
      public: false,
    },
    select: {
      url: true,
      donator: {
        select: {
          username: true,
        },
      },
    },
  });

  const data = [...public_domains, ...private_domains];
  return data;
}

export default function UploadSettings() {
  const data = useAppLoaderData();
  const urls = useLoaderData<typeof loader>() as URL[];
  const actionData = useActionData<typeof action>();

  const [templates, setTemplates] = useState<string[]>([]);
  useEffect(() => {
    fetch("/api/get-templates")
      .then((res) => res.json())
      .then((d) => {
        if (d.success) {
          setTemplates(Object.keys(d.data));
        }
      })
      .catch(() => {});
  }, []);

  const selected = data!.user.upload_preferences!.urls;

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Uploader Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <label>Upload Key:</label>
            <Input className="my-2" readOnly value={data?.user.upload_key} />
            <label>Download Configs for:</label>
            <br />
            <Button className="mr-2">
              <Link to={`/api/sharex/${data?.user.id}`}>ShareX</Link>
            </Button>
            <Button>
              <Link to={`/api/sharenix/${data?.user.id}`}>ShareNix</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Embed Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Form method="post">
              <Input
                className="hidden"
                value={"update_embed"}
                name="type"
                readOnly
              />
              <Label htmlFor="embed_title">Title</Label>
              <TemplateInput
                className="my-2"
                name="embed_title"
                defaultValue={data?.user.upload_preferences?.embed_title}
                templates={templates}
              />
              <div className="text-red-500 text-sm">
                {/* @ts-ignore */}
                {actionData?.fieldErrors.embed_title}
              </div>
              <Label htmlFor="embed_author">Author</Label>
              <TemplateInput
                className="my-2"
                name="embed_author"
                defaultValue={data?.user.upload_preferences?.embed_author}
                templates={templates}
              />
              <div className="text-red-500 text-sm">
                {/* @ts-ignore */}
                {actionData?.fieldErrors.embed_author}
              </div>
              <Label htmlFor="embed_colour">Colour</Label>
              <Input
                className="my-2"
                name="embed_colour"
                defaultValue={data?.user.upload_preferences?.embed_colour}
              />
              <datalist id="embed-templates">
                {templates.map((t) => (
                  <option key={t} value={`{{${t}}}`} />
                ))}
              </datalist>
              <div className="items-top flex space-x-2 my-2">
                <Checkbox
                  name="domain_hack"
                  defaultChecked={data?.user.upload_preferences?.domain_hack}
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
              <div className="text-red-500 text-sm">
                {/* @ts-ignore */}
                {actionData?.fieldErrors.embed_colour}
              </div>
              <Button type="submit">Save</Button>
            </Form>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Domains</CardTitle>
          </CardHeader>
          <CardContent>
            <Form method="post">
              <Input
                className="hidden"
                value={"update_urls"}
                name="type"
                readOnly
              />
              <DataTable
                columns={getColumns(
                  (data!.user.upload_preferences?.subdomains ?? {}) as Record<
                    string,
                    string
                  >
                )}
                data={urls}
                selected={selected}
              />
              <Button type="submit">Save</Button>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

const embedUpdateSchema = z.object({
  embed_title: z.string(),
  embed_author: z.string(),
  embed_colour: z
    .string()
    .length(7, { message: "Must be 7 characters long" })
    .regex(/^#/, { message: "Must be a valid hex colour" }),
  domain_hack: z.string().optional(),
});

const urlUpdateSchema = z.object({
  selected: z.string(),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  let result;

  const requestType = formData.get("type");

  const user = await getUserBySession(
    await getSession(request.headers.get("Cookie"))
  );

  if (requestType === "update_embed") {
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
        domain_hack: result.data.domain_hack === "on",
      },
    });
  }

  if (requestType === "update_urls") {
    result = urlUpdateSchema.safeParse(payload);
    if (!result.success) {
      const error = result.error.flatten();
      return {
        payload,
        formErrors: error.formErrors,
        fieldErrors: error.fieldErrors,
      };
    }

    const urls = await prisma.uRL.findMany({
      select: {
        url: true,
      },
    });

    const selectedIndices = Object.keys(JSON.parse(result.data.selected));
    let selected = selectedIndices.map((val) => {
      return urls[+val].url;
    });

    if (selected.length === 0) selected = ["jays.pics"];

    const subdomains: Record<string, string> = {};
    for (const idx of selectedIndices) {
      const domain = urls[+idx].url;
      const sub = formData.get(`subdomain_${domain}`)?.toString().trim();
      if (sub) subdomains[domain] = sub;
    }

    await prisma.uploaderPreferences.update({
      where: {
        userId: user!.id,
      },
      data: {
        urls: selected,
        subdomains,
      },
    });
  }

  return null;
}
