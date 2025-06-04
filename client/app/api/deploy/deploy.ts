// pages/api/deploy.ts
import type { NextApiRequest, NextApiResponse } from "next";
// import formidable, { File } from "formidable";
// import fs from "fs";
// import crypto from "crypto";
// import fetch from "node-fetch";

// Required to disable body parsing so formidable can handle it
export const config = {
  api: {
    bodyParser: false,
  },
};

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

if (!VERCEL_TOKEN) {
  throw new Error("VERCEL_TOKEN is not defined in environment variables");
}

// type FileMap = {
//   file: string;
//   data: Buffer;
//   sha: string;
// };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  console.log("Deploy");

  //   const form = new formidable.IncomingForm({
  //     multiples: true,
  //     keepExtensions: true,
  //   });

  //   form.parse(req, async (err, fields, files) => {
  //     if (err) {
  //       console.error("File parsing failed:", err);
  //       return res.status(500).json({ error: "File parsing failed" });
  //     }

  //     const uploadedFiles: File[] = Array.isArray(files.files)
  //       ? (files.files as File[])
  //       : [files.files as File];

  //     const fileMap: FileMap[] = uploadedFiles.map((file) => {
  //       const filePath = file.filepath ?? (file as any).path;
  //       const data = fs.readFileSync(filePath);
  //       const sha = crypto.createHash("sha1").update(data).digest("hex");
  //       return {
  //         file: file.originalFilename ?? "file",
  //         data,
  //         sha,
  //       };
  //     });

  //     try {
  //       // Step 1: Create deployment
  //       const deployRes = await fetch("https://api.vercel.com/v13/deployments", {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${VERCEL_TOKEN}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           files: fileMap.map(({ file, sha }) => ({ file, sha })),
  //           target: "production",
  //           name: "manual-static-deploy",
  //         }),
  //       });

  //       const deployJson = await deployRes.json();

  //       if (!deployRes.ok) {
  //         console.error("Vercel deployment failed:", deployJson);
  //         return res
  //           .status(500)
  //           .json({ error: "Deployment failed", details: deployJson });
  //       }

  //       // Step 2: Upload missing files
  //       for (const file of fileMap) {
  //         await fetch(`https://api.vercel.com/v13/files/${file.sha}`, {
  //           method: "PUT",
  //           headers: {
  //             Authorization: `Bearer ${VERCEL_TOKEN}`,
  //             "Content-Type": "application/octet-stream",
  //           },
  //           body: file.data,
  //         });
  //       }

  //       return res.status(200).json({ url: deployJson.url });
  //     } catch (error) {
  //       console.error("Error during deployment:", error);
  //       return res.status(500).json({ error: "Unexpected server error" });
  //     }
  //   });
}
