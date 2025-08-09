import { NextRequest, NextResponse } from "next/server";
import { generateWebsite, startResponse } from "./prompt";
import { validateRequest } from "../validateRequest";

export const runtime = "edge"; // optional but gives low-latency streaming on Vercel

export async function POST(req: NextRequest) {
  try {
    const validation = await validateRequest(req);
    if (validation instanceof NextResponse) {
      return validation;
    }
    const { type, prompt } = await req.json();
    if (type === "start") {
      const start = await startResponse(prompt);
      return start;
    } else if (type === "generate") {
      const website = await generateWebsite(prompt);
      return website;
    }
  } catch (err) {
    return NextResponse.json(err);
  }
}
