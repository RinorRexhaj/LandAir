import { useThemeStore } from "@/app/store/useThemeStore";
import React from "react";

const SkeletonProjects = () => {
  const { darkMode } = useThemeStore();

  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={`skeleton-project-${i}`}
          className={`relative overflow-hidden animate-pulse transition-transform hover:-translate-y-1 bg-inherit`}
        >
          {/* Screenshot Placeholder */}
          <div
            className={`w-full rounded-lg aspect-[16/9] ${
              darkMode ? "bg-zinc-700" : "bg-gray-300"
            }`}
          />

          {/* Text Skeleton */}
          <div className="py-2 flex flex-col gap-2">
            <div
              className={`h-6 rounded ${
                darkMode ? "bg-zinc-700" : "bg-gray-300"
              } w-2/3`}
            />
            <div
              className={`h-4 rounded ${
                darkMode ? "bg-zinc-700" : "bg-gray-300"
              } w-1/3`}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonProjects;
