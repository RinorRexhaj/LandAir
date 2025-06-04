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
    websiteGeneratorURL,
    { website_description: prompt },
    { headers: { Authorization: relevanceKey } }
  );
  return {
    taskId: response.data.task_id,
  };
};

export const checkCompletion = async (taskId: string) => {
  const response = await axios.get(`${websiteGeneratorURL}/status/${taskId}`, {
    headers: { Authorization: relevanceKey },
  });
  return response.data;
};
