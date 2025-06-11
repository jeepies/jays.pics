import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from '@remix-run/node';

import { prisma } from '~/services/database.server';
import { del } from '~/services/s3.server';

export async function action({ params }: ActionFunctionArgs) {
  const image = await prisma.image.findFirst({
    where: { id: params.id },
    select: { uploader: true, id: true, size: true },
  });
  await prisma.image.delete({ where: { id: params.id } });

  const user = await prisma.user.findFirst({
    where: {
      id: image?.uploader.id,
    },
  });

  await prisma.user.update({
    where: { id: user!.id },
    data: {
      space_used: user!.space_used - image!.size,
    },
  });

  del(`${image?.uploader.id}/${image?.id}`);
  return redirect('/dashboard/images');
}

export async function loader({ params }: LoaderFunctionArgs) {
  const image = await prisma.image.findFirst({
    where: { id: params.id },
    select: { uploader: true, id: true, size: true },
  });
  await prisma.image.delete({ where: { id: params.id } });

  const user = await prisma.user.findFirst({
    where: {
      id: image?.uploader.id,
    },
  });

  await prisma.user.update({
    where: { id: user!.id },
    data: {
      space_used: user!.space_used - image!.size,
    },
  });

  del(`${image?.uploader.id}/${image?.id}`);
  return redirect('/dashboard/images');
}
