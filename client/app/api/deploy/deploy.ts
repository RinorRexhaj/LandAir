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
  content: string
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

  return { url: deployment.url };
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
        framework: null, // Static
        devCommand: "",
        buildCommand: "",
        outputDirectory: ".", // root
      },
    }),
  });

  const json = await res.json();
  if (!res.ok) {
    return { error: json.error?.message || "Deployment failed" };
  }

  return json;
}
