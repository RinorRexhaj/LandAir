import axios from "axios";

const promptEnhancerURL = process.env.NEXT_PUBLIC_PROMPT_ENHANCER || "";
const websiteGeneratorURL = process.env.NEXT_PUBLIC_WEBSITE_GENERATOR || "";
const relevanceKey = process.env.NEXT_PUBLIC_RELEVANCE_KEY || "";

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
    { headers: { Authorization: relevanceKey }, timeout: 300000 }
  );
  return response.data.answer;
};

export const checkCompletion = async () => {
  // const res= await axios.get(`https://api.relevance.ai/v1/status/${}`)
};
