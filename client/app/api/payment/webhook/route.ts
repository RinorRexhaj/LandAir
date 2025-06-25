import { NextRequest } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const growthId = process.env.NEXT_PUBLIC_STRIPE_GROWTH || "";
const scaleId = process.env.NEXT_PUBLIC_STRIPE_SCALE || "";

// Mapping priceId to credits
const CREDIT_MAP: Record<string, number> = {
  [growthId]: 15,
  [scaleId]: 35,
};

// Read raw body for signature verification
async function buffer(
  readable: ReadableStream<Uint8Array> | null
): Promise<Buffer> {
  if (!readable) return Buffer.from("");
  const reader = readable.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  const rawBody = await buffer(req.body);
  const sig = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    console.error("⚠️ Stripe signature error:", err);
    return new Response(`Webhook Error: ${err}`, { status: 400 });
  }

  // Listen for successful checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.supabaseUserId;
    const priceId = session?.metadata?.priceId;

    if (!userId || !priceId) {
      return new Response("Missing metadata", { status: 401 });
    }

    const creditsToAdd = CREDIT_MAP[priceId];

    if (!creditsToAdd) {
      console.warn(`No credit mapping found for priceId: ${priceId}`);
      return new Response("Unknown priceId", { status: 402 });
    }

    const { error } = await supabase
      .from("Credits")
      .update({
        credits: supabase.rpc("increment_credits", {
          uid: userId,
          amount: creditsToAdd,
        }),
      })
      .eq("user_id", userId);

    if (error) {
      console.error("Supabase error updating credits:", error.message);
      return new Response("Database error", { status: 500 });
    }

    console.log(`✅ Added ${creditsToAdd} credits to user ${userId}`);
  }

  return new Response("Webhook received", { status: 200 });
}
