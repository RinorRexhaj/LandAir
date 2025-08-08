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
    setCreating?: (creating: boolean) => void,
    template?: string,
    fetch?: <T = unknown>(url: string) => Promise<T>,
    getBlob?: (endpoint: string) => Promise<Blob>
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

  createProject: async (
    toast,
    post,
    setCreating?,
    template?,
    fetch?,
    getBlob?
  ) => {
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
      setTimeout(async () => {
        if (setCreating) setCreating(false);
        if (template && fetch && getBlob) {
          try {
            const url = await fetch(`/api/storage?template=${template}`);
            const content = await fetch(`${url}`);
            projectWithGlow.file = content as string;
            const formData = new FormData();
            formData.append("content", content as string);
            formData.append("filePath", `${projectWithGlow?.id}`);
            formData.append("type", "html");

            const screenshotBlob: Blob = await getBlob(
              `/storage/v1/object/public/pages/Templates/${template}/screenshot.png`
            );
            const screenshotFile = new File(
              [screenshotBlob],
              "screenshot.png",
              { type: "image/png" }
            );
            const screenshotData = new FormData();
            screenshotData.append("content", screenshotFile);
            screenshotData.append(
              "filePath",
              `${projectWithGlow.id}/screenshot.png`
            );
            screenshotData.append("type", "image");
            await post(`/api/storage/`, formData);
            await post(`/api/storage/`, screenshotData);
          } catch (error) {
            console.error(error);
            setSelectedProject(projectWithGlow);
            toast.dismiss(toastId);
            toast.error("Could not save screenshot!");
            if (setCreating) setCreating(false);
          }
        }
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
