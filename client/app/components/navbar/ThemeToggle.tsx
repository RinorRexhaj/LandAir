import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useThemeStore } from "@/app/store/useThemeStore";

const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useThemeStore();
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className={`w-9 h-8 flex items-center justify-center rounded-md animate-slideDown [animation-fill-mode:backwards] transition-colors ${
        darkMode
          ? "bg-white/5 hover:bg-white/10"
          : "bg-zinc-200 hover:bg-zinc-400/20"
      }`}
      style={{ animationDelay: "0.2s" }}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <FontAwesomeIcon
        icon={darkMode ? faSun : faMoon}
        className={`w-4 h-4 ${
          darkMode ? "text-white" : "text-zinc-900"
        } transition-colors`}
      />
    </button>
  );
};

export default ThemeToggle;
