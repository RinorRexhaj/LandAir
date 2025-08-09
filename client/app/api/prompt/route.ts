// app/api/outline/route.ts
import { NextRequest } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { startResponse } from "./system-prompts";

export const runtime = "edge"; // optional but gives low-latency streaming on Vercel

export async function POST(req: NextRequest) {
  const body = await req.json();
  const userPrompt =
    body?.prompt ?? "Generate a short outline for a marketing website.";

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: startResponse,
    prompt: userPrompt,
    temperature: 0.2,
  });

  return result.toUIMessageStreamResponse();
}
