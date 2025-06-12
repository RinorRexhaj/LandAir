import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function createCheckoutSession({
  priceId,
  userId,
  origin,
}: {
  priceId: string;
  userId?: string;
  origin: string;
}) {
  return await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${origin}`,
    cancel_url: `${origin}`,
    metadata: {
      supabaseUserId: userId ?? "",
    },
  });
}
