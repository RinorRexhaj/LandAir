import { Project } from "@/app/types/Project";
import React, { useState, useEffect } from "react";
import ProjectHeader from "./ProjectHeader";
// import Empty from "./EmptyProject";
import Prompt from "./Prompt";
// import Generating from "./Generating";
import Preview from "./Preview";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDisplay, faRobot } from "@fortawesome/free-solid-svg-icons";
import { useThemeStore } from "@/app/store/useThemeStore";
import { baseButtonClasses, getButtonClasses } from "@/app/utils/ButtonClasses";

interface ProjectPageProps {
  selectedProject: Project;
  setSelectedProject: (project: Project | null) => void;
  changeProject: (project: Project) => void;
}

const ProjectPage: React.FC<ProjectPageProps> = ({
  selectedProject,
  setSelectedProject,
  changeProject,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [projectName, setProjectName] = useState(selectedProject.project_name);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeView, setActiveView] = useState<"preview" | "prompt">("preview");
  const { darkMode } = useThemeStore();

  useEffect(() => {
    if (selectedProject?.created) {
      setIsEditing(true);
    }
  }, [selectedProject]);

  if (!selectedProject) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <ProjectHeader
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        projectName={projectName}
        setProjectName={setProjectName}
        changeProject={changeProject}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />

      <div className="w-fit hidden z-50 absolute top-20 md:top-[72px] right-6 md:right-4 tb:flex px-2 py-1.5 rounded-lg items-center justify-center gap-2 border border-gray-200/20 bg-zinc-800/20">
        <button
          className={`${baseButtonClasses} ${getButtonClasses(
            activeView === "preview",
            darkMode
          )}`}
          onClick={() => setActiveView("preview")}
        >
          <FontAwesomeIcon icon={faDisplay} />
          <p className="md:hidden">Preview</p>
        </button>
        <button
          className={`${baseButtonClasses} ${getButtonClasses(
            activeView === "prompt",
            darkMode
          )}`}
          onClick={() => setActiveView("prompt")}
        >
          <FontAwesomeIcon icon={faRobot} />
          <p className="md:hidden">Generate</p>
        </button>
      </div>

      {/* Project Content */}
      <div
        className="w-full flex gap-6"
        style={{
          height: "calc(100vh - 160px)",
        }}
      >
        {/* Desktop Layout */}
        <div
          className={`relative w-8/12 animate-fade ${
            activeView === "preview" ? "tb:w-full" : "tb:hidden"
          }`}
        >
          <Preview />
        </div>
        <div
          className={`w-4/12 ${
            activeView === "prompt" ? "tb:w-full" : "tb:hidden"
          }`}
        >
          <Prompt
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
