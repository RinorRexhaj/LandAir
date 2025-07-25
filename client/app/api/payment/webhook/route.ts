import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const growth = process.env.NEXT_PUBLIC_PADDLE_GROWTH_ID || "";
const scale = process.env.NEXT_PUBLIC_PADDLE_SCALE_ID || "";
const key = process.env.PADDLE_KEY || "";

// Map LemonSqueezy product IDs to credits
const CREDIT_MAP: Record<string, number> = {
  [growth]: 15,
  [scale]: 35,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || !body.data) {
      return new Response("No body data", { status: 401 });
    }

    const priceId = body?.data?.items[0]?.price_id;
    const customerId = body?.data?.customer_id;

    if (!priceId || !customerId) {
      console.warn("Missing checkout data");
      return new Response("Missing checkout data", { status: 400 });
    }

    const getEmail = await fetch(
      `https://sandbox-api.paddle.com/customers/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
      }
    );
    const emailRes = await getEmail.json();
    const email = emailRes?.data?.email;

    if (!emailRes || !email) {
      console.warn("Could not get customer's email");
      return new Response("Could not get customer's email", { status: 400 });
    }

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
  } catch (err: unknown) {
    return new Response("Error: " + err, { status: 400 });
  }
}
