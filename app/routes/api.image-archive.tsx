import {
  createReadableStreamFromReadable,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { createGzip } from "node:zlib";
import { PassThrough } from "node:stream";
import tar from "tar-stream";

import { prisma } from "~/services/database.server";
import { get } from "~/services/s3.server";
import { getSession, getUserBySession } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) {
    return new Response("Unauthorized", { status: 401 });
  }
  const user = await getUserBySession(session);
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const images = await prisma.image.findMany({
    where: { uploader_id: user.id, deleted_at: null },
    select: { id: true, display_name: true },
  });

  const pack = tar.pack();

  (async () => {
    try {
      for (const image of images) {
        const blob = await get(`${user.id}/${image.id}`);
        const buffer = Buffer.from(await blob.arrayBuffer());
        pack.entry({ name: image.display_name }, buffer);
      }
      pack.finalize();
    } catch (err) {
      pack.destroy(err as Error);
    }
  })();

  const gzip = createGzip();
  const stream = pack.pipe(gzip).pipe(new PassThrough());

  const webStream = createReadableStreamFromReadable(stream);

  return new Response(webStream, {
    headers: {
      "Content-Type": "application/gzip",
      "Content-Disposition": `attachment; filename="${user.username}-images.tar.gz"`,
    },
  });
}

export async function action() {
  return new Response("Method not allowed", { status: 405 });
}
