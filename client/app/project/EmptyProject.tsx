import { useThemeStore } from "@/app/store/useThemeStore";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Empty = () => {
  const { darkMode } = useThemeStore();
  return (
    <div className="col-span-full flex flex-col items-center justify-center h-3/4 py-20 px-4 rounded-xl animate-fade">
      <FontAwesomeIcon
        icon={faWandMagicSparkles}
        className={`w-12 h-12 mb-4 ${
          darkMode ? "text-zinc-400" : "text-gray-800"
        }`}
      />
      <h3
        className={`text-lg font-medium mb-2 ${
          darkMode ? "text-white" : "text-zinc-900"
        }`}
      >
        So empty...
      </h3>
      <p
        className={`text-center max-w-sm md:w-9/12 ${
          darkMode ? "text-gray-400" : "text-zinc-600"
        }`}
      >
        Create your first project by typing your idea on the prompting section.
      </p>
    </div>
  );
};

export default Empty;
