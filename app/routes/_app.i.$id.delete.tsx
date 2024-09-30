import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { prisma } from "~/services/database.server";
import { del } from "~/services/s3.server";

export async function action({ params }: ActionFunctionArgs) {
  const image = await prisma.image.findFirst({
    where: { id: params.id },
    select: { uploader: true, id: true },
  });
  await prisma.image.delete({ where: { id: params.id } });
  del(`${image?.uploader.id}/${image?.id}`);
  return redirect("/");
}

export async function loader({ params }: LoaderFunctionArgs) {
  const image = await prisma.image.findFirst({
    where: { id: params.id },
    select: { uploader: true, id: true },
  });
  await prisma.image.delete({ where: { id: params.id } });
  del(`${image?.uploader.id}/${image?.id}`);
  return redirect("/");
}
