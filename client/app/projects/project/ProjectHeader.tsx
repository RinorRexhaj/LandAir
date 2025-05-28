import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faRocket,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useThemeStore } from "@/app/store/useThemeStore";
import useApi from "@/app/hooks/useApi";
import { Project } from "@/app/types/Project";
import { useRouter } from "next/navigation";

interface ProjectHeaderProps {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  projectName: string;
  setProjectName: (name: string) => void;
  selectedProject: Project;
  setSelectedProject: (project: Project) => void;
  changeProject: (project: Project) => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  isEditing,
  setIsEditing,
  projectName,
  setProjectName,
  selectedProject,
  changeProject,
  setSelectedProject,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { darkMode } = useThemeStore();
  const { put } = useApi();
  const router = useRouter();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameChange();
    } else if (e.key === "Escape") {
      setProjectName(selectedProject.project_name);
      setIsEditing(false);
    }
  };

  const handleNameChange = async () => {
    if (projectName.trim() === "") {
      setProjectName(selectedProject.project_name);
      setIsEditing(false);
      return;
    }

    try {
      const updatedProject: Project = await put(
        `/projects/${selectedProject.id}`,
        {
          name: projectName.trim(),
        }
      );
      setSelectedProject(updatedProject);
      changeProject(updatedProject);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update project name:", error);
      setProjectName(selectedProject.project_name);
      setIsEditing(false);
    }
  };

  return (
    <div className="relative h-8 flex items-center justify-between mb-6">
      <button
        onClick={() => router.push("/projects")}
        className={`flex items-center gap-2 py-2 rounded-lg font-medium transition-colors animate-fade ${
          darkMode ? "hover:text-white" : "hover:text-zinc-900"
        }`}
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
        <p className="md:hidden">Projects</p>
      </button>

      <div className="flex items-center gap-2">
        {isEditing ? (
          <div className="flex justify-center items-center md:gap-0.5 gap-2">
            <input
              ref={inputRef}
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`text-xl font-medium rounded-lg px-3 md:px-2 py-1 transition-all border focus:outline-none w-2/3 md:w-1/2
                ${
                  darkMode
                    ? "bg-zinc-800 text-white border-zinc-700 focus:border-blue-500"
                    : "bg-white text-zinc-900 border-zinc-300 focus:border-blue-600"
                }`}
            />
            <button
              onClick={handleNameChange}
              className={`p-1 rounded-full flex items-center justify-center transition-colors ${
                darkMode
                  ? "hover:bg-zinc-700/50 text-blue-400"
                  : "hover:bg-gray-100 text-blue-600"
              }`}
            >
              <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setProjectName(selectedProject.project_name);
                setIsEditing(false);
              }}
              className={`p-1 rounded-full flex items-center justify-center transition-colors ${
                darkMode
                  ? "hover:bg-zinc-700/50 text-red-400"
                  : "hover:bg-gray-100 text-red-600"
              }`}
            >
              <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <h2
            onClick={() => setIsEditing(true)}
            className={`text-2xl text-center md:text-xl font-semibold cursor-pointer hover:opacity-80 transition-opacity ${
              darkMode ? "text-white" : "text-zinc-900"
            }`}
          >
            {selectedProject.project_name}
          </h2>
        )}
      </div>

      <button
        className={`flex items-center gap-2 px-4 md:px-3 py-2 rounded-lg font-medium transition-colors animate-fade ${
          darkMode
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
        title="Deploy"
      >
        <FontAwesomeIcon icon={faRocket} className="w-4 h-4" />
        <p className="md:hidden">Deploy</p>
      </button>
    </div>
  );
};

export default ProjectHeader;
