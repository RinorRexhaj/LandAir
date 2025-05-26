import { useThemeStore } from "@/app/store/useThemeStore";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faFolder, faClock } from "@fortawesome/free-solid-svg-icons";
import useApi from "@/app/hooks/useApi";
import { Project } from "@/app/types/Project";
import { useTimeAgo } from "@/app/hooks/useTimeAgo";
import useAuth from "@/app/hooks/useAuth";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { darkMode } = useThemeStore();
  const { user } = useAuth();
  const { formatDate } = useTimeAgo();
  const { get, post } = useApi();

  useEffect(() => {
    const fetchProjects = async () => {
      const projects: Project[] = await get("/projects");
      setProjects(projects);
    };
    fetchProjects();
  }, [get]);

  const createProject = async () => {
    await post("/projects", { name: "New Project", user_id: user?.id });
  };

  // Number of skeleton items to show while loading
  const skeletonCount = 4;

  return (
    <div
      className={`transition-colors ${
        darkMode ? "text-gray-300" : "text-zinc-900"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-2xl font-semibold ${
            darkMode ? "text-white" : "text-zinc-900"
          } animate-fade [animation-fill-mode:backwards]`}
          style={{
            animationDelay: "0.4s",
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
            animationDelay: "0.4s",
          }}
          onClick={createProject}
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Projects List */}
      <div
        className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-cols-4 gap-4 animate-fade [animation-fill-mode:backwards]"
        style={{ animationDelay: "0.5s" }}
      >
        {projects.length <= 0
          ? // Show skeleton placeholders when loading
            Array.from({ length: skeletonCount }).map((_, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-4 rounded-xl transition-colors animate-pulse ${
                  darkMode ? "bg-zinc-700/30" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-4 w-1/2">
                  <div
                    className={`p-3 rounded-lg ${
                      darkMode ? "bg-zinc-600/50" : "bg-gray-200"
                    }`}
                  >
                    {/* Skeleton for icon */}
                    <div className="w-5 h-5 bg-gray-400 rounded"></div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {/* Skeleton for project name */}
                    <div
                      className={`h-5 rounded bg-gray-400 ${
                        darkMode ? "bg-zinc-600" : "bg-gray-300"
                      }`}
                    />
                    {/* Skeleton for created_at */}
                    <div
                      className={`w-24 h-4 rounded bg-gray-400 ${
                        darkMode ? "bg-zinc-600" : "bg-gray-300"
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))
          : // Show actual projects once loaded
            projects.map((project) => (
              <button
                key={project.id}
                className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                  darkMode
                    ? "bg-zinc-700/30 hover:bg-zinc-700/50"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      darkMode ? "bg-zinc-600/50" : "bg-gray-200"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={faFolder}
                      className={`w-5 h-5 ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <h3
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-zinc-900"
                      }`}
                    >
                      {project.project_name}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span
                        className={`flex items-center gap-1 text-sm ${
                          darkMode ? "text-gray-400" : "text-zinc-600"
                        }`}
                      >
                        <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                        {formatDate(project.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
      </div>
    </div>
  );
};

export default Projects;
