import { NextRequest, NextResponse } from "next/server";
import { changes, generateWebsite, startResponse, summary } from "./prompt";
import { validateRequest } from "../validateRequest";

export const runtime = "edge"; // optional but gives low-latency streaming on Vercel

export async function POST(req: NextRequest) {
  try {
    const validation = await validateRequest(req);
    if (validation instanceof NextResponse) {
      return validation;
    }
    const { type, prompt, code } = await req.json();
    if (type === "start") {
      const start = await startResponse(prompt);
      return start;
    } else if (type === "generate") {
      const website = await generateWebsite(prompt);
      return website;
    } else if (type === "summary") {
      const website = await summary(prompt);
      return website;
    } else if (type === "changes") {
      const website = await changes(prompt, code);
      return website;
    }
  } catch (err) {
    return NextResponse.json(err);
  }
}
