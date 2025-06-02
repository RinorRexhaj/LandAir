import { supabase } from "../utils/Supabase";

export const uploadFile = async (
  content: string,
  filePath: string
): Promise<void> => {
  console.log(content);
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
