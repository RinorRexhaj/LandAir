import { supabase } from "../supabase";

export const uploadFile = async (
  content: string,
  filePath: string
): Promise<void> => {
  const blob = new Blob([content], { type: "text/html" });
  const file = new File([blob], filePath, { type: "text/html" });
  const exists = supabase.storage.from("pages").exists(filePath);
  if (!exists) {
    await supabase.storage.from("pages").upload(filePath, file, {
      contentType: "text/html",
    });
  } else {
    await supabase.storage.from("pages").update(filePath, file, {
      contentType: "text/html",
    });
  }
};

export const deleteFile = async (filePath: string): Promise<boolean> => {
  const deleted = await supabase.storage.from("pages").remove([filePath]);
  return deleted.error !== null;
};
