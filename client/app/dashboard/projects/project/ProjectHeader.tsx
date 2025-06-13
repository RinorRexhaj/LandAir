import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faRocket,
  faCheck,
  faXmark,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { useThemeStore } from "@/app/store/useThemeStore";
import { Project } from "@/app/types/Project";
import { useProjectStore } from "@/app/store/useProjectsStore";
import DeployModal from "./DeployModal";
import useApi from "@/app/hooks/useApi";

interface ProjectHeaderProps {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  isEditing,
  setIsEditing,
}) => {
  const { selectedProject, setSelectedProject, changeProject } =
    useProjectStore();
  const [projectName, setProjectName] = useState(
    selectedProject?.project_name ?? ""
  );
  const [showDeployModal, setShowDeployModal] = useState(false);
  const { put } = useApi();
  const { darkMode } = useThemeStore();
  const inputRef = useRef<HTMLInputElement>(null);

  // Update local input state when selectedProject changes
  useEffect(() => {
    setProjectName(selectedProject?.project_name ?? "");
  }, [selectedProject]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (!selectedProject) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameChange();
    } else if (e.key === "Escape") {
      setProjectName(selectedProject.project_name);
      setIsEditing(false);
    }
  };

  const handleNameChange = async () => {
    const trimmed = projectName.trim();

    if (trimmed === "" || trimmed === selectedProject.project_name) {
      setProjectName(selectedProject.project_name); // revert
      setIsEditing(false);
      return;
    }

    try {
      const updatedProject: Project[] = await put(
        `/api/projects/${selectedProject.id}`,
        {
          new_name: projectName,
        }
      );
      changeProject(updatedProject[0]);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update project name:", error);
      setProjectName(selectedProject.project_name);
      setIsEditing(false);
    }
  };

  return (
    <>
      <div className="relative h-8 flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedProject(null)}
            className={`flex items-center gap-2 py-2 rounded-lg font-medium transition-colors animate-fade ${
              darkMode ? "hover:text-white" : "hover:text-zinc-900"
            }`}
            title="Back to Projects"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
          </button>
          {isEditing ? (
            <div className="flex justify-start items-center md:gap-0.5 gap-2">
              <input
                ref={inputRef}
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`text-lg text-left font-medium rounded-lg px-3 md:px-2 py-1 transition-all border focus:outline-none w-2/3 md:w-1/2
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
              className={`text-xl text-center md:text-xl font-semibold cursor-pointer hover:opacity-80 transition-opacity ${
                darkMode ? "text-white" : "text-zinc-900"
              }`}
            >
              {selectedProject.project_name}
            </h2>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedProject.url && (
            <a
              href={"https://" + selectedProject.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-3 py-2.5 md:px-2.5 md:py-2 rounded-lg md:rounded ${
                darkMode ? "bg-zinc-700" : "bg-gray-200"
              } flex items-center justify-center`}
              title="View Live Page"
            >
              <FontAwesomeIcon
                icon={faGlobe}
                className="h-5 w-5 md:w-4 md:h-4"
              />
            </a>
          )}

          <button
            onClick={() => setShowDeployModal(true)}
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
      </div>

      {/* Deploy Modal */}
      {showDeployModal && (
        <DeployModal setShowDeployModal={setShowDeployModal} />
      )}
    </>
  );
};

export default ProjectHeader;
