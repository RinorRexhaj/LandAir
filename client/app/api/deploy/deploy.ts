import { supabase } from "../supabase";
import { greekLetters } from "./letters";
import { getProjectUrl } from "../projects/projects";

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
  project_id: string,
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

  const deployed = await getProjectUrl(project_id);
  const subdomain =
    deployed.url?.replace(/^https?:\/\/|\.landair\.app$/g, "") ||
    (await generateUniqueSubdomain(project_name));

  const deployment = await createDeployment(files, subdomain);
  if ("error" in deployment) {
    return { error: "Error in deployment: " + deployment.error };
  }

  await waitUntilReady(deployment.id);
  const aliasRes = await aliasDeployment(deployment.id, subdomain);

  if ("error" in aliasRes) return { error: "Failed to alias deployment" };

  await updateProjectUrl(user_id, project_id, `https://${aliasRes.alias}`);
  return { url: `https://${aliasRes.alias}` };
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
      project: name,
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

export async function updateDeployment(
  user_id: string,
  project_id: string,
  projectName: string,
  newName: string
): Promise<{ success: true } | { error: string }> {
  const project = projectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const { url } = await getProjectUrl(project_id);

  const del = await fetch(
    `https://api.vercel.com/v9/projects/${project}/domains/${url.slice(8)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  const deleted = await del.json();

  if ("error" in del) {
    return { error: deleted.error.message || "Failed to update deployment" };
  }

  const res = await fetch(
    `https://api.vercel.com/v10/projects/${project}/domains`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json", // required
      },
      body: JSON.stringify({
        name: `${newName}.landair.app`, // make sure newName is a valid project name
      }),
    }
  );

  const json = await res.json();

  if (!res.ok) {
    return { error: json.error?.message || "Failed to update deployment" };
  }

  await updateProjectUrl(user_id, project_id, "https://" + json.name);

  return { success: true };
}

async function waitUntilReady(
  deploymentId: string,
  maxRetries = 20,
  interval = 3000
): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    const res = await fetch(
      `https://api.vercel.com/v13/deployments/${deploymentId}`,
      {
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
        },
      }
    );

    const data = await res.json();

    if (res.ok && data.readyState === "READY") {
      return true;
    }

    if (data.readyState === "ERROR" || data.readyState === "CANCELED") {
      throw new Error(`Deployment failed: ${data.readyState}`);
    }

    await new Promise((r) => setTimeout(r, interval));
  }

  throw new Error("Deployment did not become ready in time");
}

async function aliasDeployment(deploymentId: string, subdomain: string) {
  const alias = `${subdomain}.landair.app`;

  const res = await fetch(
    `https://api.vercel.com/v13/deployments/${deploymentId}/aliases`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ alias }),
    }
  );

  const json = await res.json();

  if (!res.ok) {
    return { error: json.error?.message || "Failed to alias deployment" };
  }

  return { alias };
}

async function isSubdomainTaken(
  subdomain: string
): Promise<boolean | { error: string }> {
  const { data, error } = await supabase.from("Projects").select("url");

  if (!data || error) {
    return { error: "Failed to fetch project URL's." };
  }

  const taken = data.some(
    (project) => project.url === `https://${subdomain}.landair.app`
  );
  return taken;
}

export async function checkDomainAvailability(
  subdomain: string
): Promise<{ available: boolean } | { error: string }> {
  try {
    // Basic validation
    const domainRegex = /^[a-z0-9-]+$/;
    if (!domainRegex.test(subdomain)) {
      return { error: "Invalid domain format" };
    }

    if (subdomain.length < 3 || subdomain.length > 63) {
      return { error: "Domain must be between 3 and 63 characters" };
    }

    // Check if subdomain is already taken
    const taken = await isSubdomainTaken(subdomain);
    if (typeof taken === "object" && "error" in taken) {
      return { error: taken.error };
    }

    return { available: !taken };
  } catch {
    return { error: "Failed to check domain availability" };
  }
}

async function generateUniqueSubdomain(baseName: string): Promise<string> {
  const base = baseName.toLowerCase().replace(/[^a-z0-9-]/g, "-");

  let attempt = base;
  let index = 0;

  while (await isSubdomainTaken(attempt)) {
    if (index >= greekLetters.length)
      throw new Error("Ran out of fallback subdomains");
    attempt = `${base}-${greekLetters[index++]}`;
  }

  return attempt;
}

export const updateProjectUrl = async (
  user_id: string,
  project_id: string,
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

export async function deleteProjectFromVercel(
  projectName: string
): Promise<{ success: true } | { error: string }> {
  console.log(projectName);
  const res = await fetch(
    `https://api.vercel.com/v10/projects/${projectName}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    }
  );

  if (!res.ok) {
    const json = await res.json();
    return {
      error: json?.error?.message || "Failed to delete project",
    };
  }

  return { success: true };
}
