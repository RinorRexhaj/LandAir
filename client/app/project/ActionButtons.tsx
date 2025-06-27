// components/ActionButtons.tsx
import React, { useState } from "react";
import {
  faArrowUpRightFromSquare,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useThemeStore } from "../store/useThemeStore";
import { handleDownload, handleOpenFullSize } from "../utils/ProjectActions";
import { useProjectStore } from "../store/useProjectsStore";

interface ActionButtonsProps {
  selector: boolean;
  toggleSelector: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  selector,
  toggleSelector,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { darkMode } = useThemeStore();
  const { selectedProject } = useProjectStore();

  return (
    <div
      className={`relative flex items-center border rounded-lg transition-all duration-200
        ${
          darkMode
            ? "bg-zinc-800/20 border-gray-200/20"
            : "bg-zinc-100/80 border-gray-300/50"
        }`}
    >
      {/* Desktop Buttons */}
      <div className="sm:hidden flex px-1.5 py-1 gap-1">
        <button
          onClick={() => handleOpenFullSize(selectedProject)}
          title="Open Full Size Page"
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-sm opacity-80 font-medium transition-all duration-200 hover:opacity-100"
        >
          <FontAwesomeIcon
            icon={faArrowUpRightFromSquare}
            className="w-3.5 h-3.5"
          />
        </button>

        <button
          onClick={() => handleDownload(selectedProject)}
          title="Download"
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-sm opacity-80 font-medium transition-all duration-200 hover:opacity-100"
        >
          <FontAwesomeIcon icon={faDownload} className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={toggleSelector}
          title="Selector"
          className={`relative flex items-center justify-center pl-1.5 pt-1.5 pr-0.5 pb-0.5 gap-1 rounded-md text-sm font-medium transition-all duration-200 ${
            selector
              ? darkMode
                ? "bg-zinc-700 text-white"
                : "bg-white text-black shadow"
              : "opacity-70 hover:opacity-100"
          }`}
        >
          <Image
            src={darkMode ? "/select-dark.png" : "/select.png"}
            alt="Selector"
            width={20}
            height={20}
          />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className="hidden sm:flex relative">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="p-2 text-sm opacity-80 hover:opacity-100"
          title="Actions Menu"
        >
          ⋮
        </button>

        {menuOpen && (
          <div
            className={`absolute left-7 w-40 z-50 flex flex-col rounded-md shadow-lg border p-2
              ${
                darkMode
                  ? "bg-zinc-900 border-gray-200/20"
                  : "bg-zinc-100/80 border-gray-300/50"
              }`}
          >
            <button
              onClick={() => {
                handleOpenFullSize(selectedProject);
                setMenuOpen(false);
              }}
              className="text-left px-2 py-1.5 hover:bg-zinc-700/20 rounded"
            >
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare}
                className="mr-2 w-4 h-4"
              />
              Full Size
            </button>

            <button
              onClick={() => {
                handleDownload(selectedProject);
                setMenuOpen(false);
              }}
              className="text-left px-2 py-1.5 hover:bg-zinc-700/20 rounded"
            >
              <FontAwesomeIcon icon={faDownload} className="mr-2 w-4 h-4" />
              Download
            </button>

            <button
              onClick={() => {
                toggleSelector();
                setMenuOpen(false);
              }}
              className="text-left px-2 py-1.5 hover:bg-zinc-700/20 rounded flex items-center"
            >
              <Image
                src={darkMode ? "/select-dark.png" : "/select.png"}
                alt="Selector"
                width={16}
                height={16}
                className="mr-2"
              />
              Selector
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionButtons;
