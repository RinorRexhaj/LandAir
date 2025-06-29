import { Project } from "@/app/types/Project";
import { supabase } from "../supabase";
import { deleteFolder } from "../storage/storage";
import { deleteChat } from "../chat/chat";
import { deleteProjectFromVercel } from "../deploy/deploy";

export const fetchProjects = async (
  user_id: string
): Promise<Project[] | { error: string }> => {
  const { data, error } = await supabase
    .from("Projects")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    return { error: "Error fetching projects:" + error.message };
  }

  return data || [];
};

export const getProjectUrl = async (
  project_id: string
): Promise<{ url: string }> => {
  const { data } = await supabase
    .from("Projects")
    .select("url")
    .eq("id", project_id);

  return { url: data ? data[0].url : "" };
};

export const addProject = async (
  user_id: string
): Promise<Project[] | { error: string }> => {
  const { count } = await supabase
    .from("Projects")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user_id);

  if (count && count >= 4) {
    return { error: "No more than 4 projects allowed!" };
  }

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
    return { error: error.message };
  }

  return data;
};

export const updateProject = async (
  user_id: string,
  project_id: string,
  updates: { new_name?: string; url?: string }
): Promise<Project[] | { error: string }> => {
  const updateData: {
    project_name?: string;
    url?: string;
    last_edited: string;
  } = {
    last_edited: new Date().toISOString(),
  };

  if (updates.new_name) {
    updateData.project_name = updates.new_name;
  }

  if (updates.url) {
    updateData.url = updates.url;
  }

  const { data, error } = await supabase
    .from("Projects")
    .update(updateData)
    .eq("id", project_id)
    .eq("user_id", user_id)
    .select();

  if (error) {
    return { error: "Error updating project:" + error.message };
  }

  return data;
};

export const deleteProject = async (projectId: string, userId: string) => {
  const { data } = await supabase
    .from("Projects")
    .select("project_name")
    .eq("id", projectId);

  const { error } = await supabase
    .from("Projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    return { error: "Error deleting project:" + error.message };
  }

  if (data && data.length > 0) {
    await deleteFolder(`${userId}/${data[0].project_name}`);
    await deleteChat(projectId);
    await deleteProjectFromVercel(data[0].project_name);
  }

  return true;
};
