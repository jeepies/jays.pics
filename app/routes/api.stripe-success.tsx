import { LoaderFunctionArgs, redirect } from "@remix-run/node";

import { prisma } from "~/services/database.server";
import { getSession, getUserBySession } from "~/services/session.server";
import { stripe } from "~/services/stripe.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const checkoutId = url.searchParams.get("session_id");
  const sessionCookie = await getSession(request.headers.get("Cookie"));
  if (!sessionCookie.has("userID") || !checkoutId)
    return redirect("/dashboard/settings");
  const user = await getUserBySession(sessionCookie);
  if (!user) return redirect("/dashboard/settings");

  const checkout = await stripe.checkout.sessions.retrieve(checkoutId);
  if (
    checkout.payment_status === "paid" &&
    checkout.metadata?.userId === user.id &&
    checkout.metadata?.storage
  ) {
    const increase = BigInt(checkout.metadata.storage);
    await prisma.user.update({
      where: { id: user.id },
      data: { max_space: BigInt(user.max_space) + increase },
    });
    if (typeof checkout.subscription === "string") {
      await prisma.storageSubscription.create({
        data: {
          user_id: user.id,
          stripe_subscription_id: checkout.subscription,
          storage: increase,
        },
      });
    }
    return redirect("/dashboard/settings?purchase=success");
  }

  return redirect("/dashboard/settings");
}

export const action = loader;
