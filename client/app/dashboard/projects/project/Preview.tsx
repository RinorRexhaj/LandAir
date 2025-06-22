import { useProjectStore } from "@/app/store/useProjectsStore";
import { useThemeStore } from "@/app/store/useThemeStore";
import {
  faArrowUpRightFromSquare,
  faCode,
  faDownload,
  faLaptop,
  faMobileScreen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import Code from "./Code";
import { handleDownload, handleOpenFullSize } from "@/app/utils/ProjectActions";
import Image from "next/image";
import Website from "./Website";

interface PreviewProps {
  getUrl: () => void;
}

const Preview: React.FC<PreviewProps> = ({ getUrl }) => {
  const [mobile, setMobile] = useState(0);
  const [selector, setSelector] = useState(false);
  const [scale, setScale] = useState(1);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const { darkMode } = useThemeStore();
  const { selectedProject } = useProjectStore();

  useEffect(() => {
    const updateScale = () => {
      if (mainRef.current) {
        const containerWidth = mainRef.current.clientWidth;
        const smallDevice = document.body.clientWidth < 1000;
        let divider = 1440;
        if (mobile) {
          divider = smallDevice ? 430 : 430 * 2.5;
        }
        setScale(containerWidth / divider);
      }
    };

    if (mobile === 2) {
      setSelector(false);
    }

    window.addEventListener("resize", updateScale);
    updateScale();
    return () => window.removeEventListener("resize", updateScale);
  }, [mobile]);

  return (
    <div
      className="w-full h-full flex flex-col gap-3 animate-fade"
      ref={mainRef}
    >
      <div className="flex gap-1 flex-wrap">
        {/* Device Toggle */}
        <div
          className={`flex px-2 py-1.5 md:gap-1 rounded-lg items-center gap-2 border transition-all duration-200 ${
            darkMode
              ? "bg-zinc-800/20 border-gray-200/20"
              : "bg-zinc-100/80 border-gray-300/50"
          }`}
        >
          <button
            onClick={() => setMobile(0)}
            title="Desktop"
            className={`flex items-center gap-1 px-3 md:px-2.5 py-1.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none ${
              mobile !== 0
                ? "opacity-70 hover:opacity-100"
                : darkMode
                ? "bg-zinc-700 text-white"
                : "bg-white text-black shadow"
            }`}
          >
            <FontAwesomeIcon icon={faLaptop} className="w-4 h-4" />
            <span className="tb:hidden">Desktop</span>
          </button>
          <button
            onClick={() => setMobile(1)}
            title="Mobile"
            className={`flex items-center gap-1 px-3 md:px-2.5 py-1.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none ${
              mobile === 1
                ? darkMode
                  ? "bg-zinc-700 text-white"
                  : "bg-white text-black shadow"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <FontAwesomeIcon icon={faMobileScreen} className="w-4 h-4" />
            <span className="tb:hidden">Mobile</span>
          </button>
          <button
            title="View Code"
            className={`flex items-center gap-1 px-3 md:px-2.5 py-1.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none ${
              mobile === 2
                ? darkMode
                  ? "bg-zinc-700 text-white"
                  : "bg-white text-black shadow"
                : "opacity-70 hover:opacity-100"
            }`}
            onClick={() => setMobile(2)}
          >
            <FontAwesomeIcon icon={faCode} className="w-4 h-4" />
            <span className="tb:hidden">Code</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div
          className={`flex px-2 py-1.5 rounded-lg items-center gap-1 md:gap-0.5 md:z-40 border transition-all duration-200 ${
            darkMode
              ? "bg-zinc-800/20 md:bg-zinc-900 border-gray-200/20"
              : "bg-zinc-100/80 md:bg-zinc-100 border-gray-300/50"
          }`}
        >
          <button
            onClick={() => handleOpenFullSize(selectedProject)}
            title="Open Full Size Page"
            className="flex items-center gap-1 px-2 py-1.5 rounded-md text-sm opacity-80 font-medium transition-all duration-200 focus:outline-none hover:opacity-100"
          >
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              className="w-4 h-4"
            />
          </button>
          <button
            onClick={() => handleDownload(selectedProject)}
            title="Download"
            className="flex items-center gap-1 px-2 py-1.5 rounded-md text-sm opacity-80 font-medium transition-all duration-200 focus:outline-none hover:opacity-100"
          >
            <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSelector(!selector)}
            title="Selector"
            className={`relative flex items-center justify-center pl-1.5 pt-1.5 pr-0.5 pb-0.5 gap-1 rounded-md text-sm font-medium transition-all duration-200  ${
              selector
                ? darkMode
                  ? "bg-zinc-700 text-white"
                  : "bg-white text-black shadow"
                : "opacity-70 hover:opacity-100"
            } focus:outline-none hover:opacity-100`}
          >
            <Image
              src={`${darkMode ? "/select-dark.png" : "/select.png"}`}
              alt="Selector"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className={`relative w-full h-full flex overflow-hidden`}>
        {(scale < 1 || mobile) && selectedProject?.file && mobile < 2 && (
          <Website
            selector={selector}
            setSelector={setSelector}
            mobile={mobile}
            scale={scale}
          />
        )}
        {mobile === 2 && (
          <Code file={selectedProject?.file || ""} getUrl={getUrl} />
        )}
      </div>
    </div>
  );
};

export default Preview;
