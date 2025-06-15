import { ActionFunctionArgs, json, redirect } from "@remix-run/node";

import { getSession, getUserBySession } from "~/services/session.server";
import { stripe } from "~/services/stripe.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) return redirect("/login");
  const user = await getUserBySession(session);
  if (!user) return redirect("/login");

  const base = process.env.BASE_DOMAIN
    ? `https://${process.env.BASE_DOMAIN}`
    : "http://localhost";

  const checkout = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "gbp",
          unit_amount: 199,
          product_data: { name: "500MB Storage Increase" },
        },
        quantity: 1,
      },
    ],
    success_url: `${base}/api/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/dashboard/settings`,
    metadata: { userId: user.id },
  });

  return redirect(checkout.url ?? "/dashboard/settings");
}

export async function loader() {
  return json({ ok: false });
}
