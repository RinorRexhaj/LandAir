import { useThemeStore } from "@/app/store/useThemeStore";
import React from "react";

const Projects = () => {
  const { darkMode } = useThemeStore();

  return (
    <div
      className={`rounded-2xl p-6 shadow-md border transition-colors ${
        darkMode
          ? "bg-zinc-800/30 border-zinc-700/30 text-gray-300"
          : "bg-white border-gray-200 text-zinc-900"
      }`}
    >
      <h2
        className={`text-xl font-semibold mb-4 ${
          darkMode ? "text-white" : "text-zinc-900"
        }`}
      >
        Projects
      </h2>

      {/* Sample Stats or Content */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className={`rounded-xl p-4 transition-colors ${
            darkMode ? "bg-zinc-600/30" : "bg-gray-100"
          }`}
        >
          <p className="text-sm">Active Projects</p>
          <p
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-zinc-900"
            }`}
          >
            12
          </p>
        </div>

        <div
          className={`rounded-xl p-4 transition-colors ${
            darkMode ? "bg-zinc-600/30" : "bg-gray-100"
          }`}
        >
          <p className="text-sm">Team Members</p>
          <p
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-zinc-900"
            }`}
          >
            5
          </p>
        </div>
      </div>
    </div>
  );
};

export default Projects;
