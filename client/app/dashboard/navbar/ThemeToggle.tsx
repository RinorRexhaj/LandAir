import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      onToggle(); // This will trigger the theme change
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [onToggle]);

  return (
    <button
      onClick={onToggle}
      className={`p-2 rounded-lg transition-colors ${
        isDark ? "hover:bg-white/5" : "hover:bg-zinc-400/20"
      }`}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <FontAwesomeIcon
        icon={isDark ? faSun : faMoon}
        className={`w-5 h-5 ${
          isDark ? "text-gray-400 hover:text-white" : "text-zinc-900"
        } transition-colors`}
      />
    </button>
  );
};

export default ThemeToggle;
