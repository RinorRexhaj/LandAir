import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const growth = process.env.NEXT_PUBLIC_PADDLE_GROWTH_ID || "";
const scale = process.env.NEXT_PUBLIC_PADDLE_SCALE_ID || "";

// Map LemonSqueezy product IDs to credits
const CREDIT_MAP: Record<string, number> = {
  [growth]: 15,
  [scale]: 35,
};

export async function POST(req: NextRequest) {
  const body = await req.json();

  return new Response(body);
  if (!body) {
    return new Response("No body data", { status: 401 });
  }

  const priceId = body.items[0].price.id;
  const email = "rinorrexhaj10@gmail.com";

  const creditsToAdd = CREDIT_MAP[priceId];
  if (!creditsToAdd) {
    console.warn("No credit mapping for product ID:", priceId);
    return new Response("Unknown product", { status: 400 });
  }

  // You must map email to your Supabase user_id
  const { data: userId, error } = await supabase.rpc("get_user_id_by_email", {
    input_email: email,
  });

  if (error || !userId) {
    console.error("❌ Could not find user for email: ", error?.message);
    return new Response("User not found", { status: 404 });
  }

  const { error: updateError } = await supabase.rpc("add_credits_by_email", {
    input_email: email,
    credits_to_add: creditsToAdd,
  });
  if (updateError) {
    console.error("❌ Could not update credits: ", updateError?.message);
    return new Response("User not found", { status: 404 });
  }

  console.log(`✅ Added ${creditsToAdd} credits to user ${userId}`);
  return new Response("OK", { status: 200 });
}
