import { Project } from "@/app/types/Project";
import React, { useState, useEffect } from "react";
import ProjectHeader from "./ProjectHeader";
import Empty from "./EmptyProject";
import Prompt from "./Prompt";
import Generating from "./Generating";

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

      {/* Project Content */}
      <div
        className="w-full flex gap-6"
        style={{
          height: "calc(100vh - 160px)",
        }}
      >
        <div className="relative w-8/12 h-full animate-fade">
          {isGenerating ? <Generating /> : <Empty />}
          {/* <Generating /> */}
        </div>
        <div className="w-4/12">
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
