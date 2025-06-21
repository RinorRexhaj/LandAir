import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "../validateRequest";
import { getImageUrlFromDescription } from "./images";

export async function GET(req: NextRequest) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) {
    return validation;
  }
  const searchParams = req.nextUrl.searchParams;
  const words = searchParams.get("words");
  if (words) {
    const url = await getImageUrlFromDescription(words);
    return NextResponse.json(url);
  }
}
