import React from "react";
import { useThemeStore } from "../store/useThemeStore";

const Templates = () => {
  const { darkMode } = useThemeStore();

  return (
    <div className="flex items-center justify-between">
      <h2
        className={`text-xl font-semibold ${
          darkMode ? "text-white" : "text-zinc-900"
        } transition-all animate-fade [animation-fill-mode:backwards]`}
        style={{
          animationDelay: "0.1s",
        }}
      >
        Templates
      </h2>
    </div>
  );
};

export default Templates;
