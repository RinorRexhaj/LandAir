import { useThemeStore } from "@/app/store/useThemeStore";
import React from "react";

const SkeletonProjects = () => {
  const { darkMode } = useThemeStore();

  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={`skeleton-project-${i}`}
          className={`relative rounded-xl overflow-hidden animate-pulse transition-transform hover:-translate-y-1 ${
            darkMode ? "bg-zinc-700/30" : "bg-gray-200/60"
          }`}
        >
          {/* Screenshot Placeholder */}
          <div
            className={`w-full h-40 ${
              darkMode ? "bg-zinc-600" : "bg-gray-300"
            }`}
          />

          {/* Text Skeleton */}
          <div className="p-4 flex flex-col gap-2">
            <div
              className={`h-5 rounded ${
                darkMode ? "bg-zinc-600" : "bg-gray-300"
              } w-3/4`}
            />
            <div
              className={`h-4 rounded ${
                darkMode ? "bg-zinc-600" : "bg-gray-300"
              } w-1/3`}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonProjects;
