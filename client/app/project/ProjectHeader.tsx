import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useThemeStore } from "@/app/store/useThemeStore";
import { useProjectStore } from "@/app/store/useProjectsStore";
import DeployModal from "./DeployModal";

const ProjectHeader = () => {
  const { selectedProject } = useProjectStore();
  const [showDeployModal, setShowDeployModal] = useState(false);
  const { darkMode } = useThemeStore();

  if (!selectedProject) return null;

  return (
    <>
      <div className="flex items-center gap-2">
        {selectedProject.url && (
          <a
            href={"https://" + selectedProject.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-2 py-1.5 rounded-md ${
              darkMode ? "bg-white/5 text-white" : "bg-gray-200 text-zinc-900"
            } flex items-center justify-center`}
            title="View Live Page"
          >
            <FontAwesomeIcon icon={faGlobe} className="h-5 w-5" />
          </a>
        )}

        <button
          onClick={() => setShowDeployModal(true)}
          className={`flex items-center gap-2 px-2.5 py-2 rounded-md font-medium transition-colors animate-fade ${
            darkMode
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
          title="Deploy"
        >
          <FontAwesomeIcon icon={faRocket} className="w-4 h-4" />
          {/* <p className="text-sm md:hidden">Deploy</p> */}
        </button>
      </div>

      {/* Deploy Modal */}
      {showDeployModal && (
        <DeployModal setShowDeployModal={setShowDeployModal} />
      )}
    </>
  );
};

export default ProjectHeader;
