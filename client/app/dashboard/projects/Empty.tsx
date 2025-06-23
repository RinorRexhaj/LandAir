import { useThemeStore } from "@/app/store/useThemeStore";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Empty = () => {
  const { darkMode } = useThemeStore();
  return (
    <div className="col-span-full mt-2 flex gap-5 h-full px-4 rounded-xl">
      <FontAwesomeIcon
        icon={faFolderOpen}
        className={`w-16 h-16 md:h-12 md:w-12 mb-4 ${
          darkMode ? "text-zinc-600" : "text-gray-400"
        }`}
      />
      <div className="flex flex-col text-start">
        <h3
          className={`text-xl md:text-md font-medium mb-2 ${
            darkMode ? "text-white" : "text-zinc-900"
          }`}
        >
          No projects yet
        </h3>
        <p
          className={`${
            darkMode ? "text-gray-400" : "text-zinc-600"
          } md:text-sm`}
        >
          Click the &ldquo;New Project&rdquo; button above to begin.
        </p>
      </div>
    </div>
  );
};

export default Empty;
