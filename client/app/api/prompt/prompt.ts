import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { generatePrompt, startPrompt } from "./system-prompts";

export const startResponse = async (prompt: string) => {
  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: startPrompt,
    prompt,
    temperature: 0.2,
  });

  return result.toUIMessageStreamResponse();
};

export const generateWebsite = async (prompt: string) => {
  const result = streamText({
    model: openai("gpt-4.1"),
    system: generatePrompt,
    prompt,
    temperature: 0.25,
  });

  return result.toTextStreamResponse();
};
