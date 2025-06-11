import { ActionFunctionArgs, json } from '@remix-run/node';

import { prisma } from '~/services/database.server';
import { getSession, getUserBySession } from '~/services/session.server';

export async function action({ request, params }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  if (!session.has('userID')) return json({ success: false, message: 'Not authorized' }, { status: 401 });
  const user = await getUserBySession(session);
  if (!user) return json({ success: false, message: 'Not authorized' }, { status: 401 });

  await prisma.notification.updateMany({
    where: { id: params.id, receiver_id: user.id },
    data: { seen: true },
  });

  return json({ success: true });
}

export async function loader() {
  return json({ success: false, message: 'post only' }, { status: 405 });
}
