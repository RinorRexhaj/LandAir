import { useProjectStore } from "@/app/store/useProjectsStore";
import { useThemeStore } from "@/app/store/useThemeStore";
import {
  faCode,
  faLaptop,
  faMobileScreen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import Code from "./Code";
import Website from "./Website";
import ActionButtons from "./ActionButtons";

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
        let containerWidth = mainRef.current.clientWidth;
        const smallDevice = document.body.clientWidth < 500;
        // const mediumDevice = document.body.clientWidth < 1000;
        let divider = 1440;
        const clientWidth = document.body.clientWidth;
        const clientHeight = document.body.clientHeight;
        if (clientWidth < 500 && mobile === 0) {
          setMobile(1);
        }
        if (mobile) {
          divider = 1000;
          if (!smallDevice) {
            containerWidth = 900;
          } else {
            containerWidth =
              divider * (0.9 + clientWidth / (clientHeight * 20));
          }
        }
        // else {
        //   if (mediumDevice) {
        //     containerWidth = 800;
        //   } else {
        //   }
        // }
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
          className={`flex px-1.5 gap-1 rounded-lg items-center border transition-all duration-200 ${
            darkMode
              ? "bg-zinc-800/20 border-gray-200/20"
              : "bg-zinc-100/80 border-gray-300/50"
          }`}
        >
          <button
            onClick={() => setMobile(0)}
            title="Desktop"
            className={`flex sm:hidden items-center gap-1 px-2 py-1.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none ${
              mobile !== 0
                ? "opacity-70 hover:opacity-100"
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
                : "opacity-70 hover:opacity-100"
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
                : "opacity-70 hover:opacity-100"
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
