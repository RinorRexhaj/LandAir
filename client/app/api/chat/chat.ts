import { supabase } from "../supabase";

export const deleteChat = async (project_id: number) => {
  const { error } = await supabase
    .from("Chats")
    .delete()
    .eq("project_id", project_id);
  if (error) {
    console.error("Error deleting chat:", error?.message);
    return false;
  }
};
