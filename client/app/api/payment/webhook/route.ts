import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Map LemonSqueezy product IDs to credits
const CREDIT_MAP: Record<number, number> = {
  561452: 15,
  561453: 35,
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const event = body.meta?.event_name;

  if (event !== "order_created") {
    return new Response("Unhandled event type", { status: 202 });
  }

  if (!body.data) {
    return new Response("No body data", { status: 401 });
  }

  const order = body?.data;
  const productId = order.attributes.first_order_item.product_id;
  const email = order.attributes.user_email;

  const creditsToAdd = CREDIT_MAP[productId];
  if (!creditsToAdd) {
    console.warn("No credit mapping for product ID:", productId);
    return new Response("Unknown product", { status: 400 });
  }

  // You must map email to your Supabase user_id
  const { data: userId, error } = await supabase.rpc("get_user_id_by_email", {
    input_email: email,
  });

  if (error || !userId) {
    console.error("❌ Could not find user for email", error?.message);
    return new Response("User not found", { status: 404 });
  }

  // Get current credits
  const { data, error: creditsFetchError } = await supabase
    .from("Credits")
    .select("credits")
    .eq("user_id", userId)
    .single();

  if (creditsFetchError || !data) {
    console.error("❌ Credits not found for user!", creditsFetchError?.message);
    return new Response("Credits not found", { status: 404 });
  }

  const currentCredits = data.credits;
  const newCredits = currentCredits + creditsToAdd;

  // Update credits
  const { error: updateError } = await supabase
    .from("Credits")
    .update({ credits: newCredits })
    .eq("user_id", userId);

  if (updateError) {
    console.error("❌ Failed to update credits:", updateError.message);
    return new Response("Failed to update credits", { status: 500 });
  }

  console.log(`✅ Added ${creditsToAdd} credits to user ${userId}`);
  return new Response("OK", { status: 200 });
}
