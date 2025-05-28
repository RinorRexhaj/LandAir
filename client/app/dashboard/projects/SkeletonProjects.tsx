import { useThemeStore } from "@/app/store/useThemeStore";
import React from "react";

const SkeletonProjects = () => {
  const { darkMode } = useThemeStore();
  return Array.from({ length: 4 }).map((_, i) => (
    <div
      key={"skeleton-project-" + i}
      className={`flex items-center justify-between p-4 rounded-xl transition-colors animate-pulse ${
        darkMode ? "bg-zinc-700/30" : "bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-4 w-1/2">
        <div
          className={`p-3 rounded-lg ${
            darkMode ? "bg-zinc-600/50" : "bg-gray-200"
          }`}
        >
          {/* Skeleton for icon */}
          <div className="w-5 h-5 bg-gray-400 rounded"></div>
        </div>
        <div className="flex-1 space-y-2">
          {/* Skeleton for project name */}
          <div
            className={`h-5 rounded bg-gray-400 ${
              darkMode ? "bg-zinc-600" : "bg-gray-300"
            }`}
          />
          {/* Skeleton for created_at */}
          <div
            className={`w-24 h-4 rounded bg-gray-400 ${
              darkMode ? "bg-zinc-600" : "bg-gray-300"
            }`}
          />
        </div>
      </div>
    </div>
  ));
};

export default SkeletonProjects;
