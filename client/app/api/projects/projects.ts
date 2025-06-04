import { Project } from "@/app/types/Project";
import { supabase } from "../supabase";
import { deleteFile } from "../storage/storage";

export const fetchProjects = async (user_id: string): Promise<Project[]> => {
  const { data, error } = await supabase
    .from("Projects")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error.message);
    return [];
  }

  return data || [];
};

export const addProject = async (user_id: string): Promise<Project[]> => {
  const { data, error } = await supabase
    .from("Projects")
    .insert([
      {
        user_id,
        project_name: "New Project",
        last_edited: new Date().toISOString(),
      },
    ])
    .select();

  if (error) {
    console.error("Error adding project:", error.message);
    return [];
  }

  return data;
};

export const updateProject = async (
  user_id: string,
  project_id: number,
  new_name: string
): Promise<Project[]> => {
  const { data, error } = await supabase
    .from("Projects")
    .update({ project_name: new_name, last_edited: new Date().toISOString() })
    .eq("id", project_id)
    .eq("user_id", user_id)
    .select();

  if (error) {
    console.error("Error adding project:", error.message);
    return [];
  }

  return data;
};

export const deleteProject = async (projectId: number, userId: string) => {
  const { data } = await supabase
    .from("Projects")
    .select("project_name")
    .eq("id", projectId);

  const { error } = await supabase
    .from("Projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    console.error("Error deleting project:", error?.message);
    return false;
  }

  if (data) {
    await deleteFile(`${userId}/${data}`);
  }

  return true;
};
