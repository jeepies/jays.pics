import { Progress } from "@prisma/client";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { CloudflareError } from "cloudflare";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { createZone, getNameServers } from "~/services/cloudflare.server";
import { prisma } from "~/services/database.server";
import { getSession, getUserBySession } from "~/services/session.server";

export default function AddDomain() {
  const { domain, data } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>What domain would you like to link?</CardTitle>
        </CardHeader>
        <CardContent>
          {!domain ? (
            <Form method="POST">
              <Input
                name="action"
                value="set_domain"
                readOnly
                className="hidden"
              />
              <Input id="domain" placeholder="domain.com" name="domain" />
              <Button className="mt-2 w-full">Start</Button>
            </Form>
          ) : (
            <>
              <Input readOnly defaultValue={domain} name="domain" />
              <Button className="mt-2 w-full" disabled>
                Start
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {!domain ? (
        <></>
      ) : (
        <Card className="mt-2">
          <CardHeader>
            <CardTitle>Change Nameservers</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Please update your nameservers to point too</Label>
            <Input
              className="mt-2"
              readOnly
              defaultValue={data!.nameServers[0]}
            />
            <Input
              className="mt-2"
              readOnly
              defaultValue={data!.nameServers[1]}
            />
            <Form method="POST">
              <Input
                name="domain"
                defaultValue={domain}
                readOnly
                className="hidden"
              />
              <Input
                name="action"
                value="updated_nameservers"
                readOnly
                className="hidden"
              />
              <Button className="mt-2 w-full">Done</Button>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const paramEntries = Object.fromEntries(url.searchParams.entries());

  let data = { nameServers: ["", ""] };
  if (paramEntries.zid) {
    Object.assign(data, {
      nameServers: await getNameServers(paramEntries.zid),
    });
  }

  return { domain: paramEntries.domain, data: data };
}

const domainSchema = z.object({
  domain: z
    .string({ required_error: "This field is required" })
    .regex(/[a-z-]+\.[a-z]+/i, "Please enter a valid domain"),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  const result = domainSchema.safeParse(payload);

  if (!result.success) {
    const error = result.error.flatten();
    return {
      payload,
      formErrors: error.formErrors,
      fieldErrors: error.fieldErrors,
    };
  }

  const requestType = formData.get("action");

  if (requestType === "set_domain") {
    const domain = await prisma.uRL.findFirst({
      where: { url: result.data.domain },
    });

    if (domain !== null) {
      return {
        payload,
        formErrors: [],
        fieldErrors: {
          domain: "This domain already exists. Please refresh the page",
        },
      };
    }

    const check = await prisma.uRL.count({
      where: { url: result.data.domain },
    });
    if (check === 0) {
      let zone;
      try {
        zone = await createZone(result.data.domain);
      } catch (err: any) {
        if (err instanceof CloudflareError) {
          const e = JSON.parse(err.message.slice(4, err.message.length));
          if (!e.errors[0].message.includes("already exists")) {
            await prisma.log.create({
              data: {
                message: e.errors[0].message,
              },
            });
            return {
              payload,
              formErrors: [
                "An unknown error has occured. This has been logged.",
              ],
              fieldErrors: {
                domain: null,
              },
            };
          }
        }
      }

      const user = await getUserBySession(
        await getSession(request.headers.get("Cookie"))
      );

      await prisma.uRL.create({
        data: {
          donator_id: user?.id,
          url: result.data.domain,
          public: false,
          connected: false,
          zone_id: zone!.id,
        },
      });
    }

    const url = await prisma.uRL.findFirst({
      where: { url: result.data.domain },
    });

    return redirect(
      "/dashboard/domain/add?domain=" +
        result.data.domain +
        "&zid=" +
        url!.zone_id +
        "&progress=nameservers"
    );
  }

  if (requestType === "updated_nameservers") {
    await prisma.uRL.update({
      where: {
        url: result.data.domain,
      },
      data: {
        progress: Progress.WAITING,
      },
    });
    return redirect("/");
  }
}
