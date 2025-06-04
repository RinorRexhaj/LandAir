import { NextResponse } from "next/server";
import crypto from "crypto";
import fetch from "node-fetch";

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

if (!VERCEL_TOKEN) {
  throw new Error("VERCEL_TOKEN is not defined in environment variables");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const fileMap = await Promise.all(
      files.map(async (fileEntry) => {
        if (!(fileEntry instanceof File)) {
          throw new Error("Invalid file entry");
        }
        const buffer = Buffer.from(await fileEntry.arrayBuffer());
        const sha = crypto.createHash("sha1").update(buffer).digest("hex");
        return {
          file: fileEntry.name,
          data: buffer,
          sha,
        };
      })
    );

    // Step 1: Create deployment
    const deployRes = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: fileMap.map(({ file, sha }) => ({ file, sha })),
        target: "production",
        name: "manual-static-deploy",
      }),
    });

    const deployJson = (await deployRes.json()) as VercelDeploymentResponse;

    if (!deployRes.ok) {
      console.error("Vercel deployment failed:", deployJson);
      return NextResponse.json(
        { error: "Deployment failed", details: deployJson },
        { status: 500 }
      );
    }

    // Step 2: Upload missing files
    for (const file of fileMap) {
      await fetch(`https://api.vercel.com/v13/files/${file.sha}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          "Content-Type": "application/octet-stream",
        },
        body: file.data,
      });
    }

    return NextResponse.json({ url: deployJson.url });
  } catch (error) {
    console.error("Error during deployment:", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
