import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHmac, timingSafeEqual } from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const growth = process.env.NEXT_PUBLIC_PADDLE_GROWTH_ID || "";
const scale = process.env.NEXT_PUBLIC_PADDLE_SCALE_ID || "";
const key = process.env.PADDLE_KEY || "";
const webhookKey = process.env.PADDLE_WEBHOOK_KEY || "";

// Map LemonSqueezy product IDs to credits
const CREDIT_MAP: Record<string, number> = {
  [growth]: 15,
  [scale]: 35,
};

export async function POST(req: NextRequest) {
  try {
    const headers = req.headers;
    const paddleSignature = headers.get("paddle-signature");

    // (Optional) Check if header and secret key are present and return error if not
    if (!paddleSignature) {
      console.error("Paddle-Signature not present in request headers");
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    if (!key || !webhookKey) {
      console.error("Secret key not defined");
      return NextResponse.json(
        { message: "Server misconfigured" },
        { status: 500 }
      );
    }

    const body = await verifySignature(req, paddleSignature);

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

const verifySignature = async (
  request: NextRequest,
  paddleSignature: string
) => {
  if (!paddleSignature.includes(";")) {
    console.error("Invalid Paddle-Signature format");
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const parts = paddleSignature.split(";");

  if (parts.length !== 2) {
    console.error("Invalid Paddle-Signature format");
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const [timestampPart, signaturePart] = parts.map(
    (part) => part.split("=")[1]
  );

  if (!timestampPart || !signaturePart) {
    console.error(
      "Unable to extract timestamp or signature from Paddle-Signature header"
    );
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const timestamp = timestampPart;
  const signature = signaturePart;

  // (Optional) Check timestamp against current time and reject if it's over 5 seconds old
  const timestampInt = parseInt(timestamp) * 1000; // Convert seconds to milliseconds

  if (isNaN(timestampInt)) {
    console.error("Invalid timestamp format");
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const currentTime = Date.now();

  if (currentTime - timestampInt > 5000) {
    console.error(
      "Webhook event expired (timestamp is over 5 seconds old):",
      timestampInt,
      currentTime
    );
    return NextResponse.json({ message: "Event expired" }, { status: 408 });
  }

  // 3. Build signed payload
  const bodyRaw = await request.text();
  const signedPayload = `${timestamp}:${bodyRaw}`;

  // 4. Hash signed payload using HMAC SHA256 and the secret key
  const hashedPayload = createHmac("sha256", webhookKey)
    .update(signedPayload, "utf8")
    .digest("hex");

  // 5. Compare signatures
  if (!timingSafeEqual(Buffer.from(hashedPayload), Buffer.from(signature))) {
    console.error("Computed signature does not match Paddle signature");
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  // 6. Process the webhook event
  const bodyJson = JSON.parse(bodyRaw);
  return bodyJson;
};
