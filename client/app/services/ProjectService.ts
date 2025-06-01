// utils/supabaseService.ts
import { Project } from "../types/Project";
import { supabase } from "../utils/Supabase";

export const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from("Projects")
    .select("*")
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

export const deleteProject = async (projectId: string) => {
  const { error } = await supabase
    .from("Projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    console.error("Error deleting project:", error.message);
    return false;
  }

  return true;
};
