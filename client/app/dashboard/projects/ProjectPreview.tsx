import { useTimeAgo } from "@/app/hooks/useTimeAgo";
import { useProjectStore } from "@/app/store/useProjectsStore";
import { useThemeStore } from "@/app/store/useThemeStore";
import { Project } from "@/app/types/Project";
import { faClock, faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface ProjectPreviewProps {
  project: Project;
  sortBy: string;
}

const ProjectPreview: React.FC<ProjectPreviewProps> = ({ project, sortBy }) => {
  const { darkMode } = useThemeStore();
  const { setSelectedProject } = useProjectStore();
  const { formatTime } = useTimeAgo();

  const formatProjectDate = (project: Project) => {
    const date =
      sortBy === "alphabetical"
        ? project.last_edited
        : sortBy === "Created"
        ? project.created_at
        : project.last_edited;
    const text = sortBy === "alphabetical" ? "Edited" : sortBy;
    return (
      text +
      " " +
      formatTime(date) +
      (formatTime(date).startsWith("now") ? "" : " ago")
    );
  };

  return (
    <button
      className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
        darkMode
          ? "bg-zinc-700/30 hover:bg-zinc-700/50"
          : "bg-gray-50 hover:bg-gray-100"
      }`}
      onClick={() => setSelectedProject(project)}
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
              {formatProjectDate(project)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ProjectPreview;
