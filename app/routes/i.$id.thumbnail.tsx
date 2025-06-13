import { LoaderFunctionArgs } from '@remix-run/node';
import sharp from 'sharp';

import { prisma } from '~/services/database.server';
import { get } from '~/services/s3.server';

export async function loader({ params }: LoaderFunctionArgs) {
  const image = await prisma.image.findFirst({ where: { id: params.id } });
  if (!image) return new Response('Not found', { status: 404 });
  const user = await prisma.user.findFirst({ where: { id: image.uploader_id } });
  if (!user) return new Response('Not found', { status: 404 });

  const data = await get(`${user.id}/${image.id}`);
  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const resized = await sharp(buffer).resize({ width: 256, height: 256, fit: 'inside' }).toBuffer();

  return new Response(resized, {
    headers: {
      'Content-Type': image.type,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}