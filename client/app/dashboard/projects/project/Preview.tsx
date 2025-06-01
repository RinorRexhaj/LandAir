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

const Preview = () => {
  const [mobile, setMobile] = useState(false);
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

    window.addEventListener("resize", updateScale);
    updateScale();
    return () => window.removeEventListener("resize", updateScale);
  }, [mobile]);

  const handleOpenFullSize = () => {
    const blob = new Blob([selectedProject?.file || ""], {
      type: "text/html",
    });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const handleDownload = () => {
    const blob = new Blob([selectedProject?.file || ""], {
      type: "text/html",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedProject?.project_name || "landing"}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="w-full h-full flex flex-col gap-3 animate-fade"
      ref={mainRef}
    >
      <div className="flex gap-2 md:gap-1 flex-wrap">
        {/* Device Toggle */}
        <div
          className={`flex px-2 py-1.5 rounded-lg items-center gap-2 border transition-all duration-200 ${
            darkMode
              ? "bg-zinc-800/20 border-gray-200/20"
              : "bg-zinc-100/80 border-gray-300/50"
          }`}
        >
          <button
            onClick={() => setMobile(false)}
            title="Desktop"
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none ${
              mobile
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
            onClick={() => setMobile(true)}
            title="Mobile"
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none ${
              mobile
                ? darkMode
                  ? "bg-zinc-700 text-white"
                  : "bg-white text-black shadow"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <FontAwesomeIcon icon={faMobileScreen} className="w-4 h-4" />
            <span className="tb:hidden">Mobile</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div
          className={`flex px-2 py-1.5 rounded-lg items-center gap-1 md:gap-0.5 border transition-all duration-200 ${
            darkMode
              ? "bg-zinc-800/20 border-gray-200/20"
              : "bg-zinc-100/80 border-gray-300/50"
          }`}
        >
          <button
            onClick={handleOpenFullSize}
            title="Open Full Size"
            className="flex items-center gap-1 px-2 py-1.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none hover:opacity-100"
          >
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              className="w-4 h-4"
            />
          </button>

          <button
            title="View Code"
            className="flex items-center gap-1 px-2 py-1.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none hover:opacity-100"
          >
            <FontAwesomeIcon icon={faCode} className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownload}
            title="Download"
            className="flex items-center gap-1 px-2 py-1.5 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none hover:opacity-100"
          >
            <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div
        className={`relative w-full h-full flex rounded-lg shadow-md overflow-hidden p-1 border ${
          darkMode ? "border-zinc-600/80" : "border-zinc-600/20"
        }`}
      >
        {(scale < 1 || mobile) && selectedProject?.file && (
          <iframe
            key={selectedProject.file}
            srcDoc={selectedProject?.file}
            className="rounded-lg shadow-md"
            style={{
              border: "none",
              width: mobile ? "417px" : "1420px",
              transform: `scale(${scale})`,
              height: mobile ? "calc(100vh - 100px)" : "100vh",
              transformOrigin: "top left",
              position: "fixed",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Preview;
