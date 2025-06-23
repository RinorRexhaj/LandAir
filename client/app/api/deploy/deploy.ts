import { DeploymentDetails } from "@/app/types/Deployment";
import { supabase } from "../supabase";

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

if (!VERCEL_TOKEN) {
  throw new Error("Missing VERCEL_TOKEN in environment variables");
}

interface DeployFile {
  file: string;
  data: string;
  encoding: "base64";
}

export async function deploy(
  project_name: string,
  project_id: number,
  content: string,
  user_id: string
): Promise<{ url: string } | { error: string }> {
  const buffer = Buffer.from(content, "utf-8");

  const files: DeployFile[] = [
    {
      file: "index.html",
      data: buffer.toString("base64"),
      encoding: "base64",
    },
  ];

  const deployment = await createDeployment(files, project_name);
  if ("error" in deployment) return { error: "Error in deployment" };

  const details = await getDeploymentDetails(project_name);
  if ("error" in details) return { error: "Error in deployment" };

  // Update project in Supabase
  await updateProjectUrl(user_id, project_id, details.url);

  return { url: details.url };
}

async function createDeployment(files: DeployFile[], name: string) {
  const res = await fetch("https://api.vercel.com/v13/deployments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      target: "production",
      files,
      projectSettings: {
        framework: null, // Static site
        devCommand: "",
        buildCommand: "",
        outputDirectory: ".",
      },
    }),
  });

  const json = await res.json();
  if (!res.ok) {
    return { error: json.error?.message || "Deployment failed" };
  }

  return json;
}

export async function getDeploymentDetails(
  projectName: string
): Promise<DeploymentDetails | { error: string }> {
  const res = await fetch(
    `https://api.vercel.com/v10/projects/${projectName}/domains`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    }
  );

  const json = await res.json();

  if (!res.ok || !json.domains?.length) {
    return { error: json.error?.message || "Failed to fetch deployment" };
  }

  const mainDomain = json.domains[0];

  return {
    url: mainDomain.name,
    createdAt: mainDomain.createdAt,
    updatedAt: mainDomain.updatedAt,
    verified: mainDomain.verified,
  };
}

export const updateProjectUrl = async (
  user_id: string,
  project_id: number,
  url: string
): Promise<boolean | { error: string }> => {
  const { error } = await supabase
    .from("Projects")
    .update({
      last_edited: new Date().toISOString(),
      url,
    })
    .eq("user_id", user_id)
    .eq("id", project_id)
    .select();

  if (error) {
    console.error("Error updating project URL:", error.message);
  }
  return true;
};
