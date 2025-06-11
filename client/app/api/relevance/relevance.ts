import axios from "axios";

const promptEnhancerURL = process.env.PROMPT_ENHANCER || "";
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

export const checkCompletion = async (taskId: string) => {
  const response = await axios.get(
    `${websiteGeneratorURL}/async_poll/${taskId}?ending_update_only=true`,
    {
      headers: { Authorization: relevanceKey },
    }
  );
  return response.data;
};
