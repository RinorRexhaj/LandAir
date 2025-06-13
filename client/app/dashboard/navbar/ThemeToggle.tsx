import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useThemeStore } from "@/app/store/useThemeStore";

const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useThemeStore();
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className={`w-10 h-8 flex items-center justify-center rounded-lg animate-slideDown [animation-fill-mode:backwards] transition-colors ${
        darkMode ? "hover:bg-white/5" : "hover:bg-zinc-400/20"
      }`}
      style={{ animationDelay: "0.2s" }}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <FontAwesomeIcon
        icon={darkMode ? faSun : faMoon}
        className={`w-5 h-5 ${
          darkMode ? "text-gray-400 hover:text-white" : "text-zinc-900"
        } transition-colors`}
      />
    </button>
  );
};

export default ThemeToggle;
