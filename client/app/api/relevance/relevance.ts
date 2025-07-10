import { Relevance, RelevanceOutput } from "@/app/types/Relevance";
import axios from "axios";

const promptEnhancerURL = process.env.PROMPT_ENHANCER || "";
const summaryURL = process.env.WEBSITE_SUMMARY || "";
const changesURL = process.env.WEBSITE_CHANGES || "";
const websiteGeneratorURL = process.env.WEBSITE_GENERATOR || "";
const relevanceKey = process.env.RELEVANCE_KEY || "";

export const enhancePrompt = async (prompt: string) => {
  const response = await axios.post(
    promptEnhancerURL,
    { user_prompt: prompt },
    { headers: { Authorization: relevanceKey } }
  );
  return response.data;
};

export const generateSummary = async (code: string) => {
  const response = await axios.post(
    summaryURL,
    { code: code },
    { headers: { Authorization: relevanceKey } }
  );
  return response.data;
};

export const generateWebsite = async (prompt: string) => {
  const response = await axios.post(
    `${websiteGeneratorURL}/trigger_async`,
    {
      params: { website_description: prompt },
      project: relevanceKey.split(":")[0],
    },
    { headers: { Authorization: relevanceKey } }
  );
  return response.data.job_id;
};

export const makeChanges = async (code: string, prompt: string) => {
  const response = await axios.post(
    `${changesURL}/trigger_async`,
    {
      params: { code, changes: prompt },
      project: relevanceKey.split(":")[0],
    },
    { headers: { Authorization: relevanceKey } }
  );
  return response.data.job_id;
};

export const checkCompletion = async (
  type: "generate" | "changes",
  taskId: string
): Promise<RelevanceOutput> => {
  const url = type === "generate" ? websiteGeneratorURL : changesURL;
  const { data }: { data: Relevance } = await axios.get(
    `${url}/async_poll/${taskId}?ending_update_only=true`,
    {
      headers: { Authorization: relevanceKey },
    }
  );
  return {
    type: data.type,
    update: data.updates[data.updates.length - 1]?.output?.output,
  };
};
