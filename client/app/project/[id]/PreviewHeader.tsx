import {
  faCode,
  faLaptop,
  faMobileScreen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import ActionButtons from "./ActionButtons";
import { useThemeStore } from "@/app/store/useThemeStore";

interface PreviewHeaderProps {
  selector: boolean;
  setSelector: (sel: boolean) => void;
  mobile: number;
  setMobile: (mobile: number) => void;
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({
  selector,
  setSelector,
  mobile,
  setMobile,
}) => {
  const { darkMode } = useThemeStore();

  return (
    <div
      className={`fixed top-0.5 z-40 left-[45%] -translate-x-1/2 flex gap-1 flex-wrap rounded-md px-1.5 py-1`}
    >
      {/* Device Toggle */}
      <div
        className={`flex px-1.5 py-1 gap-1 rounded-lg items-center transition-all duration-200 ${
          darkMode
            ? "bg-zinc-800/80 border-gray-200/20"
            : "bg-zinc-100/80 border-gray-300/50"
        }`}
      >
        <button
          onClick={() => setMobile(0)}
          title="Desktop"
          className={`flex sm:hidden items-center gap-1 px-2 py-1.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none ${
            mobile !== 0
              ? `opacity-70 hover:opacity-100 ${
                  darkMode ? "hover:bg-zinc-700" : "hover:bg-zinc-200"
                }`
              : darkMode
              ? "bg-zinc-700 text-white"
              : "bg-white text-black shadow"
          }`}
        >
          <FontAwesomeIcon icon={faLaptop} className="w-4 h-4" />
        </button>
        <button
          onClick={() => setMobile(1)}
          title="Mobile"
          className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none ${
            mobile === 1
              ? darkMode
                ? "bg-zinc-700 text-white"
                : "bg-white text-black shadow"
              : `opacity-70 hover:opacity-100 ${
                  darkMode ? "hover:bg-zinc-700" : "hover:bg-zinc-200"
                }`
          }`}
        >
          <FontAwesomeIcon icon={faMobileScreen} className="w-4 h-4" />
        </button>
        <button
          title="View Code"
          className={`flex items-center gap-1 px-2  py-1.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none ${
            mobile === 2
              ? darkMode
                ? "bg-zinc-700 text-white"
                : "bg-white text-black shadow"
              : `opacity-70 hover:opacity-100 ${
                  darkMode ? "hover:bg-zinc-700" : "hover:bg-zinc-200"
                }`
          }`}
          onClick={() => setMobile(2)}
        >
          <FontAwesomeIcon icon={faCode} className="w-4 h-4" />
        </button>
      </div>

      {/* Action Buttons */}
      <ActionButtons
        selector={selector}
        toggleSelector={() => setSelector(!selector)}
      />
    </div>
  );
};

export default PreviewHeader;
