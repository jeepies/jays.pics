import { ActionFunctionArgs, json, redirect } from "@remix-run/node";

import { getSession, getUserBySession } from "~/services/session.server";
import { stripe } from "~/services/stripe.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) return redirect("/login");
  const user = await getUserBySession(session);
  if (!user) return redirect("/login");

  // const base = process.env.BASE_DOMAIN
  //   ? `https://${process.env.BASE_DOMAIN}`
  //   : "http://localhost:5173";

  const base = "http://localhost:5173";

  const url = new URL(request.url);
  const order = url.searchParams.get("order") ?? "500mb";

  const tiers: Record<
    string,
    { amount: number; storage: number; name: string }
  > = {
    "500mb": {
      amount: 49,
      storage: 500 * 1024 * 1024,
      name: "500MB Storage Increase",
    },
    "1gb": {
      amount: 199,
      storage: 1024 * 1024 * 1024,
      name: "1GB Storage Increase",
    },
    "5gb": {
      amount: 399,
      storage: 5 * 1024 * 1024 * 1024,
      name: "5GB Storage Increase",
    },
  };

  const tier = tiers[order] ?? tiers["500mb"];

  const checkout = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price_data: {
          currency: "gbp",
          unit_amount: tier.amount,
          recurring: { interval: "month" },
          product_data: { name: tier.name },
        },
        quantity: 1,
      },
    ],
    success_url: `${base}/api/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/dashboard/settings`,
    metadata: {
      userId: user.id,
      storage: tier.storage.toString(),
    },
  });

  return redirect(checkout.url ?? "/dashboard/settings");
}

export async function loader() {
  return json({ ok: false });
}
