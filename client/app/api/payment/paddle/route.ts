import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "../../validateRequest";
import { getPaddleToken } from "./paddle";

export async function GET(req: NextRequest) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) {
    return validation;
  }
  const token = await getPaddleToken();
  return NextResponse.json({ token });
}
