import { ActionFunctionArgs, json } from "@remix-run/node";

import { prisma } from "~/services/database.server";
import { getSession, getUserBySession } from "~/services/session.server";
import { stripe } from "~/services/stripe.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) return json({ ok: false }, { status: 401 });
  const user = await getUserBySession(session);
  if (!user) return json({ ok: false }, { status: 401 });

  const subscription = await prisma.storageSubscription.findFirst({
    where: { id: params.id, user_id: user.id },
  });
  if (!subscription) return json({ ok: false }, { status: 404 });

  try {
    await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
  } catch (err) {
    return json({ ok: false }, { status: 500 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { max_space: BigInt(user.max_space) - BigInt(subscription.storage) },
  });

  await prisma.storageSubscription.delete({ where: { id: subscription.id } });

  return json({ ok: true });
}

export const loader = action;
