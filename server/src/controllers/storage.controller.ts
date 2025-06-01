import { Request, Response } from "express";
import supabase from "../lib/supabaseClient";

// POST /upload
export const uploadFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as any).user;
  const file = (req as any).file;
  console.log(file);

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  const filePath = `uploads/${file.originalName}`;
  const { data, error } = await supabase.storage
    .from("pages")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) {
    res.status(500).json({ message: "Failed to upload file", error });
    return;
  }

  res.status(200).json({ path: data.path });
};

// GET /:filename
export const getFileUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as any).user;
  const { filename } = req.params;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const filePath = `${user.id}/${filename}`;
  const { data, error } = await supabase.storage
    .from("pages")
    .createSignedUrl("test.html", 60 * 5); // valid for 5 minutes
  console.log(data);

  if (error || !data?.signedUrl) {
    res
      .status(404)
      .json({ message: "File not found or failed to generate URL", error });
    return;
  }

  res.status(200).json({ url: data.signedUrl });
};
