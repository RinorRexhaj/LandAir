import { NextResponse, NextRequest } from "next/server";
import { validateRequest } from "../validateRequest";
import { createCheckoutSession } from "./payment";

export async function POST(req: NextRequest) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) return validation;

  const { priceId } = await req.json();
  if (!priceId) {
    return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
  }

  try {
    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await createCheckoutSession({
      priceId,
      userId: validation.user.id,
      origin,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: unknown) {
    console.error("Checkout session error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
