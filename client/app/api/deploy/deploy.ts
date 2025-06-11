import crypto from "crypto";

export async function deploy(): Promise<{ url: string } | { error: string }> {
  const htmlContent = `<html><body><h1>Hello from dynamic deploy</h1></body></html>`;
  const buffer = Buffer.from(htmlContent, "utf-8");
  const sha = crypto.createHash("sha1").update(buffer).digest("hex");

  const files = [
    {
      file: "index.html",
      data: buffer,
      sha,
    },
  ];

  const deployment = await createDeployment(files);
  if ("error" in deployment) return deployment;

  // Upload file content
  for (const f of files) {
    await uploadFileToVercel(f.sha, f.data);
  }

  return { url: deployment.url };
}

async function createDeployment(files: { file: string; sha: string }[]) {
  const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
  if (!VERCEL_TOKEN) return { error: "Missing VERCEL_TOKEN" };

  const res = await fetch("https://api.vercel.com/v13/deployments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "manual-deploy",
      target: "production",
      files,
    }),
  });

  const json = await res.json();
  if (!res.ok) return { error: json.error?.message || "Deployment failed" };
  return json;
}

async function uploadFileToVercel(sha: string, data: Buffer) {
  const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
  await fetch(`https://api.vercel.com/v13/files/${sha}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/octet-stream",
    },
    body: data,
  });
}
