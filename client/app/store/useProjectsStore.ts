import { create } from "zustand";
import { Project } from "../types/Project";

interface ProjectStore {
  projects: Project[];
  selectedProject: Project | null;
  setProjects: (projects: Project[]) => void;
  setSelectedProject: (project: Project | null) => void;
  changeProject: (project: Project) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  selectedProject: null,
  setProjects: (projects) => set({ projects }),
  setSelectedProject: (project) => set({ selectedProject: project }),

  changeProject: (project) => {
    const { projects } = get();
    const updated = projects.map((p) => (p.id === project.id ? project : p));
    set({ projects: updated });

    const { selectedProject } = get();
    if (selectedProject?.id === project.id) {
      set({ selectedProject: project });
    }
  },
}));
