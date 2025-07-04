import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "../validateRequest";
import {
  checkCompletion,
  enhancePrompt,
  generateSummary,
  generateWebsite,
} from "./relevance";

export async function GET(req: NextRequest) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) {
    return validation;
  }
  const searchParams = req.nextUrl.searchParams;
  const taskId = searchParams.get("taskId");
  if (taskId) {
    const poll = await checkCompletion(taskId);
    return NextResponse.json(poll);
  }
}

export async function POST(req: NextRequest) {
  const validation = await validateRequest(req);
  if (validation instanceof NextResponse) {
    return validation;
  }
  const { type, prompt, code } = await req.json();
  if (type === "generate") {
    const website = await generateWebsite(prompt);
    return NextResponse.json(website);
  } else if (type === "summary") {
    const summary = await generateSummary(code);
    return NextResponse.json(summary);
  } else {
    const enhanced = await enhancePrompt(prompt);
    return NextResponse.json(enhanced);
  }
}
