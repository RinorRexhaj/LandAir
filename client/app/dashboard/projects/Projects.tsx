import { useThemeStore } from "@/app/store/useThemeStore";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import useApi from "@/app/hooks/useApi";
import { Project } from "@/app/types/Project";
import useAuth from "@/app/hooks/useAuth";
import CustomSelect from "./CustomSelect";
import ProjectPage from "./project/Project";
import SkeletonProjects from "./SkeletonProjects";
import ProjectPreview from "./ProjectPreview";
import Empty from "./Empty";
import Creating from "./Creating";

type SortOption = "Edited" | "Created" | "alphabetical";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [creating, setCreating] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("Edited");
  const { darkMode } = useThemeStore();
  const { user } = useAuth();
  const { loading, get, post } = useApi();

  const sortOptions = [
    { value: "Edited" as SortOption, label: "Last Edited" },
    { value: "Created" as SortOption, label: "Last Created" },
    { value: "alphabetical" as SortOption, label: "Alphabetical" },
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      const projects: Project[] = await get("/projects");
      setProjects(projects);
    };
    fetchProjects();
  }, [get]);

  const createProject = async () => {
    setCreating(true);
    const newProject: Project[] = await post("/projects", {
      name: "New Project",
      user_id: user?.id,
    });
    newProject[0].created = true;
    setProjects([newProject[0], ...projects]);
    setTimeout(() => {
      setCreating(false);
      setSelectedProject(newProject[0]);
    }, 300);
  };

  const changeProject = (project: Project) => {
    setProjects(
      projects.map((p) => {
        if (p.id === project.id) return project;
        return p;
      })
    );
  };

  const sortProjects = (projects: Project[]): Project[] => {
    return [...projects].sort((a, b) => {
      switch (sortBy) {
        case "Edited":
          return (
            new Date(b.last_edited).getTime() -
            new Date(a.last_edited).getTime()
          );
        case "Created":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "alphabetical":
          return a.project_name.localeCompare(b.project_name);
        default:
          return 0;
      }
    });
  };

  return (
    <div
      className={`transition-colors ${
        darkMode ? "text-gray-300" : "text-zinc-900"
      }`}
    >
      {selectedProject ? (
        <ProjectPage
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          changeProject={changeProject}
        />
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h2
              className={`text-2xl font-semibold ${
                darkMode ? "text-white" : "text-zinc-900"
              } animate-fade [animation-fill-mode:backwards]`}
              style={{
                animationDelay: "0.1s",
              }}
            >
              Projects
            </h2>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } animate-fade [animation-fill-mode:backwards]`}
              style={{
                animationDelay: "0.2s",
              }}
              onClick={createProject}
            >
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
              New Project
            </button>
          </div>

          <CustomSelect
            value={sortBy}
            onChange={setSortBy}
            options={sortOptions}
            darkMode={darkMode}
          />

          {/* Projects List */}
          <div
            className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-cols-4 gap-4 animate-fade [animation-fill-mode:backwards]"
            style={{ animationDelay: "0.15s" }}
          >
            {loading && !creating ? (
              <SkeletonProjects />
            ) : (
              !creating &&
              sortProjects(projects).map((project) => (
                <ProjectPreview
                  key={"project-" + project.id}
                  project={project}
                  setSelectedProject={setSelectedProject}
                  sortBy={sortBy}
                />
              ))
            )}
            {!loading && projects.length <= 0 && !creating && <Empty />}
            {creating && <Creating />}
          </div>
        </>
      )}
    </div>
  );
};

export default Projects;
