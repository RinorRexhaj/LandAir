import { create } from "zustand";
import { Project } from "../types/Project";

interface ProjectStore {
  projects: Project[];
  selectedProject: Project | null;
  setProjects: (projects: Project[]) => void;
  setSelectedProject: (project: Project | null) => void;
  changeProject: (project: Project) => void;
  createProject: (
    toast: ReturnType<typeof import("../hooks/useToast").default>,
    post: <T = unknown, D = unknown>(url: string, data?: D) => Promise<T>,
    setCreating?: (creating: boolean) => void
  ) => Promise<void>;
  deleteProject: (
    e: React.MouseEvent,
    toast: ReturnType<typeof import("../hooks/useToast").default>,
    project: Project,
    del: <T = unknown, D = unknown>(url: string, data?: D) => Promise<T>,
    setActiveModal: (modalId: string | null) => void
  ) => Promise<void>;
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

  createProject: async (toast, post, setCreating?) => {
    const { projects, setProjects, setSelectedProject } = get();
    if (projects.length >= 4) {
      toast.warning("Only 4 or less projects allowed.");
      return;
    }
    if (setCreating) setCreating(true);
    const toastId = toast.loading("Creating project...");
    try {
      const newProject: Project[] = await post("/api/projects/");
      const projectWithGlow = { ...newProject[0], created: true };
      setProjects([projectWithGlow, ...projects]);
      setTimeout(() => {
        if (setCreating) setCreating(false);
        setSelectedProject(projectWithGlow);
        toast.dismiss(toastId);
        toast.success("Project Created!");
      }, 300);
    } catch (err) {
      console.error(err);
      toast.dismiss(toastId);
      toast.error("Something went wrong!");
      if (setCreating) setCreating(false);
    }
  },

  deleteProject: async (e, toast, project, del, setActiveModal) => {
    e.stopPropagation();
    const { projects, setProjects } = get();
    try {
      const success = await del(`/api/projects/${project.id}`);
      await del(`/api/storage?filePath=${project.id}`);
      if (success) {
        setProjects(projects.filter((p) => p.id !== project.id));
        toast.success("Successfully deleted!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }

    setActiveModal(null);
  },
}));
