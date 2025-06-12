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
  if ("error" in deployment) return deployment;

  // Get production domain (preferred over `deployment.url`)
  const productionDomain = deployment?.alias?.[0] || deployment?.url;

  // Update project in Supabase
  await updateProjectUrl(user_id, project_id, productionDomain);

  return { url: productionDomain };
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

export const updateProjectUrl = async (
  user_id: string,
  project_id: number,
  url: string
): Promise<void> => {
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
};
