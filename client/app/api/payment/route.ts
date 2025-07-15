import { NextResponse, NextRequest } from "next/server";
import { validateRequest } from "../validateRequest";
import { createCheckoutSession } from "./payment";

export async function POST(req: NextRequest) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) return validation;

  const { type } = await req.json();
  if (!type) {
    return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
  }

  try {
    const session = await createCheckoutSession({
      type,
      userId: validation.user.id,
      email: validation.user.email || "",
    });

    if ("error" in session) {
      console.error("Checkout session error:", session.error);
      return NextResponse.json({ error: session.error }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Checkout session error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
