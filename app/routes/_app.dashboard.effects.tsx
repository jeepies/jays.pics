import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { prisma } from "~/services/database.server";
import { del, uploadToS3 } from "~/services/s3.server";
import { getSession, getUserBySession } from "~/services/session.server";

import { useAppLoaderData } from "./_app";

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) return redirect("/login");
  const user = await getUserBySession(session);
  const formData = await request.formData();
  if (formData.get("remove_overlay")) {
    if (user!.upload_preferences?.effect_overlay) {
      await del(user!.upload_preferences.effect_overlay);
    }
    await prisma.uploaderPreferences.update({
      where: { userId: user!.id },
      data: { effect_overlay: null },
    });
    return redirect("/dashboard/effects");
  }
  const effect = formData.get("effect");
  let overlayKey = user!.upload_preferences?.effect_overlay ?? null;

  const overlay = formData.get("overlay");
  if (overlay && overlay instanceof File && overlay.size > 0) {
    const ext = overlay.type.split("/")[1] ?? "png";
    overlayKey = `effects/${user!.id}/${Date.now()}.${ext}`;
    const res = await uploadToS3(overlay, overlayKey);
    if (!res || res.$metadata.httpStatusCode !== 200) {
      overlayKey = user!.upload_preferences?.effect_overlay ?? null;
    }
  }

  await prisma.uploaderPreferences.update({
    where: { userId: user!.id },
    data: { effect: String(effect), effect_overlay: overlayKey },
  });

  return redirect("/dashboard/effects");
}

export default function Effects() {
  const data = useAppLoaderData();
  const prefs = data?.user.upload_preferences;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Image Effects</CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            method="post"
            encType="multipart/form-data"
            className="space-y-4"
          >
            <label htmlFor="effect">Effect</label>
            <Select name="effect" defaultValue={prefs?.effect ?? "none"}>
              <SelectTrigger id="effect">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="grayscale">Grayscale</SelectItem>
                <SelectItem value="sepia">Sepia</SelectItem>
              </SelectContent>
            </Select>
            <label htmlFor="overlay">Overlay Image</label>
            <Input id="overlay" name="overlay" type="file" accept="image/*" />
            {prefs?.effect_overlay && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground break-all">
                  Current: {prefs.effect_overlay}
                </p>
                <Form method="post">
                  <input type="hidden" name="remove_overlay" value="1" />
                  <Button type="submit" variant="destructive">
                    Remove Overlay
                  </Button>
                </Form>
              </div>
            )}
            <Button type="submit">Save</Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
