import { Request, Response } from "express";
import supabase from "../lib/supabaseClient";

// GET /projects/:id
export const getProjectById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as any).user;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { id } = req.params;

  const { data, error } = await supabase
    .from("Projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  res.json(data);
};

// GET /projects
export const getUserProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as any).user;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { data, error } = await supabase
    .from("Projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    res.status(500).json({ message: "Failed to fetch projects", error });
    return;
  }

  res.json(data);
};

// POST /projects
export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as any).user;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { name } = req.body;

  const { data, error } = await supabase
    .from("Projects")
    .insert([
      {
        user_id: user.id,
        project_name: name,
        last_edited: new Date().toISOString(),
      },
    ])
    .select();

  if (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create project", error });
    return;
  }

  res.status(201).json(data);
};

// PUT /projects/:id
export const updateProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as any).user;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { id } = req.params;
  const { name } = req.body;

  const { data, error } = await supabase
    .from("Projects")
    .update({ project_name: name, last_edited: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .select();

  if (error || !data || data.length === 0) {
    res.status(404).json({ message: "Failed to update or not authorized" });
    return;
  }

  res.json(data[0]);
};

// DELETE /projects/:id
export const deleteProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as any).user;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { id } = req.params;

  const { error } = await supabase
    .from("Projects")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    res.status(500).json({ message: "Failed to delete project", error });
    return;
  }

  res.status(204).send();
};
