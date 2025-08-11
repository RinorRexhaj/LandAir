import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import {
  changesPrompt,
  generatePrompt,
  startPrompt,
  summaryPrompt,
} from "./system-prompts";

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

export const summary = async (prompt: string) => {
  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: summaryPrompt,
    prompt,
    temperature: 0.2,
  });

  return result.toTextStreamResponse();
};

export const changes = async (prompt: string, code: string) => {
  const result = streamText({
    model: openai("gpt-4.1"),
    system: changesPrompt(prompt, code),
    prompt,
  });

  return result.toTextStreamResponse();
};
