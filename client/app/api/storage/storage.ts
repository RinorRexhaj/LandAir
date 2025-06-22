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

export const uploadImage = async (
  file: File,
  filePath: string
): Promise<string> => {
  const MAX_SIZE = 1 * 1024 * 1024; // 1MB

  if (file.size > MAX_SIZE) {
    throw new Error("File size exceeds 1MB limit.");
  }

  const { error } = await supabase.storage
    .from("pages")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    throw new Error("Image upload failed: " + error.message);
  }

  const { data } = supabase.storage.from("pages").getPublicUrl(filePath);
  return data.publicUrl;
};

export const deleteFile = async (filePath: string): Promise<boolean> => {
  const deleted = await supabase.storage.from("pages").remove([filePath]);
  return deleted.error !== null;
};

export const deleteFolder = async (folderPath: string): Promise<boolean> => {
  console.log(folderPath);
  const collectFiles = async (path: string): Promise<string[]> => {
    const { data, error } = await supabase.storage.from("pages").list(path);
    if (error || !data) return [];

    const filesToDelete: string[] = [];

    for (const item of data) {
      if (item.name) {
        if (item.metadata) {
          // It's a file
          filesToDelete.push(`${path}/${item.name}`);
        } else {
          // It's a folder — recurse into it
          const subFiles = await collectFiles(`${path}/${item.name}`);
          filesToDelete.push(...subFiles);
        }
      }
    }

    return filesToDelete;
  };

  const filesToDelete = await collectFiles(folderPath);

  if (filesToDelete.length === 0) return true;

  const { error: deleteError } = await supabase.storage
    .from("pages")
    .remove(filesToDelete);

  return deleteError === null;
};
