// components/ActionButtons.tsx
import React, { useState } from "react";
import {
  faArrowUpRightFromSquare,
  faCrosshairs,
  faDownload,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useThemeStore } from "../../store/useThemeStore";
import { handleDownload, handleOpenFullSize } from "../../utils/ProjectActions";
import { useProjectStore } from "../../store/useProjectsStore";

interface ActionButtonsProps {
  selector: boolean;
  mobile: number;
  toggleSelector: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  selector,
  mobile,
  toggleSelector,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { darkMode } = useThemeStore();
  const { selectedProject } = useProjectStore();

  return (
    <div
      className={`relative flex items-center  rounded-lg transition-all duration-200
        ${
          darkMode
            ? "bg-zinc-800/80 border-gray-200/20"
            : "bg-zinc-100/80 border-gray-300/50"
        }`}
    >
      {/* Desktop Buttons */}
      <div className="sm:hidden flex px-1.5 py-1 gap-1">
        <button
          onClick={() => handleOpenFullSize(selectedProject)}
          title="Open Full Size Page"
          className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-sm opacity-80 font-medium transition-all duration-200 hover:opacity-100 ${
            darkMode ? "hover:bg-zinc-700" : "hover:bg-zinc-200"
          }`}
        >
          <FontAwesomeIcon
            icon={faArrowUpRightFromSquare}
            className="w-3.5 h-3.5"
          />
        </button>

        <button
          onClick={() => handleDownload(selectedProject)}
          title="Download"
          className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-sm opacity-80 font-medium transition-all duration-200 hover:opacity-100 ${
            darkMode ? "hover:bg-zinc-700" : "hover:bg-zinc-200"
          }`}
        >
          <FontAwesomeIcon icon={faDownload} className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={toggleSelector}
          disabled={mobile === 2}
          title="Selector"
          className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-sm opacity-80 font-medium transition-all duration-200 hover:opacity-100 ${
            !selector
              ? `opacity-70 hover:opacity-100 ${
                  darkMode ? "hover:bg-zinc-700" : "hover:bg-zinc-200"
                }`
              : darkMode
              ? "bg-zinc-700 text-white"
              : "bg-white text-black shadow"
          }`}
        >
          <FontAwesomeIcon icon={faCrosshairs} className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className="hidden sm:flex relative">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="p-2 text-sm opacity-80 hover:opacity-100 "
          title="Actions Menu"
        >
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </button>

        {menuOpen && (
          <div
            className={`absolute left-7 w-40 z-50 flex flex-col rounded-md shadow-lg border p-2
              ${
                darkMode
                  ? "bg-zinc-900 border-gray-200/20"
                  : "bg-zinc-50 border-gray-300/50"
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
              disabled={mobile === 2}
              onClick={() => {
                toggleSelector();
                setMenuOpen(false);
              }}
              className="text-left px-2 py-1.5 hover:bg-zinc-700/20 rounded"
            >
              <FontAwesomeIcon icon={faCrosshairs} className="mr-2 w-4 h-4" />
              Selector
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionButtons;
