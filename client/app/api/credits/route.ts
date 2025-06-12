import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "../validateRequest";
import { getCredits, spendCredits } from "./credits";

export async function GET(req: NextRequest) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) {
    return validation;
  }

  const credits = await getCredits(validation.user.id);

  if ("error" in credits) {
    return NextResponse.json({ error: credits.error }, { status: 500 });
  }
  return NextResponse.json(credits);
}

export async function PUT(req: NextRequest) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) {
    return validation;
  }

  const credits = await spendCredits(validation.user.id);
  if ("error" in credits) {
    return NextResponse.json({ error: credits.error }, { status: 500 });
  }
  return NextResponse.json(credits);
}
