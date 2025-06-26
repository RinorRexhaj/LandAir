import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Map LemonSqueezy product IDs to credits
const CREDIT_MAP: Record<string, number> = {
  product_id_growth: 15,
  product_id_scale: 35,
};

export async function POST(req: NextRequest) {
  const body = await req.json();

  const event = req.headers.get("x-lemonsqueezy-event");
  if (event !== "order_created") {
    return new Response("Unhandled event type", { status: 202 });
  }

  const order = body.data;
  const productId = order.relationships.product.data.id;
  const email = order.attributes.user_email;

  const creditsToAdd = CREDIT_MAP[productId];
  if (!creditsToAdd) {
    console.warn("No credit mapping for product ID:", productId);
    return new Response("Unknown product", { status: 400 });
  }

  // You must map email to your Supabase user_id
  const { data: userRow, error: fetchError } = await supabase
    .from("Users")
    .select("id")
    .eq("email", email)
    .single();

  if (fetchError || !userRow) {
    console.error("User not found for email:", email);
    return new Response("User not found", { status: 404 });
  }

  const userId = userRow.id;

  const { error: updateError } = await supabase
    .from("Credits")
    .update({
      credits: supabase.rpc("increment_credits", {
        uid: userId,
        amount: creditsToAdd,
      }),
    })
    .eq("user_id", userId);

  if (updateError) {
    console.error("Supabase update failed:", updateError.message);
    return new Response("DB update failed", { status: 500 });
  }

  console.log(`✅ Added ${creditsToAdd} credits to user ${userId}`);
  return new Response("OK", { status: 200 });
}
