import { supabase } from "../supabase";

export const getFile = async (filePath: string) => {
  const { data } = supabase.storage.from("pages").getPublicUrl(filePath);
  return data.publicUrl;
};

export const uploadFile = async (
  content: string,
  filePath: string
): Promise<void> => {
  const blob = new Blob([content], { type: "text/html" });
  const file = new File([blob], filePath, { type: "text/html" });

  const { error } = await supabase.storage
    .from("pages")
    .upload(filePath, file, {
      contentType: "text/html",
      upsert: true, // this will replace the file if it exists
    });

  if (error) {
    throw new Error("Upload failed: " + error.message);
  }
};

export const deleteFile = async (filePath: string): Promise<boolean> => {
  const deleted = await supabase.storage.from("pages").remove([filePath]);
  return deleted.error !== null;
};
