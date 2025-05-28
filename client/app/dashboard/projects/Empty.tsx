import { useThemeStore } from "@/app/store/useThemeStore";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Empty = () => {
  const { darkMode } = useThemeStore();
  return (
    <div className="col-span-full flex flex-col items-center justify-center h-full py-20 px-4 rounded-xl">
      <FontAwesomeIcon
        icon={faFolderOpen}
        className={`w-12 h-12 mb-4 ${
          darkMode ? "text-zinc-600" : "text-gray-400"
        }`}
      />
      <h3
        className={`text-lg font-medium mb-2 ${
          darkMode ? "text-white" : "text-zinc-900"
        }`}
      >
        No projects yet
      </h3>
      <p
        className={`text-center max-w-md md:w-9/12 ${
          darkMode ? "text-gray-400" : "text-zinc-600"
        }`}
      >
        Create your first project to get started. Click the &ldquo;New
        Project&rdquo; button above to begin.
      </p>
    </div>
  );
};

export default Empty;
