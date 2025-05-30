import { useThemeStore } from "@/app/store/useThemeStore";
import { baseButtonClasses, getButtonClasses } from "@/app/utils/ButtonClasses";
import { faLaptop, faMobileScreen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";

const Preview = () => {
  const [mobile, setMobile] = useState(false);
  const [scale, setScale] = useState(1);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const { darkMode } = useThemeStore();

  useEffect(() => {
    const updateScale = () => {
      if (mainRef.current) {
        const containerWidth = mainRef.current.clientWidth;
        const smallDevice = document.body.clientWidth < 1000;
        let divider = 1440;
        if (mobile) {
          if (smallDevice) {
            divider = 430;
          } else {
            divider = 430 * 2.5;
          }
        }
        setScale(containerWidth / divider);
      }
    };

    window.addEventListener("resize", updateScale);
    updateScale(); // Initial run after mount

    return () => {
      window.removeEventListener("resize", updateScale);
    };
  }, [mobile]);

  return (
    <div className="w-full h-full flex flex-col gap-4" ref={mainRef}>
      <div className="w-fit flex px-2 py-1.5 rounded-lg items-center justify-center gap-2 border border-gray-200/20 bg-zinc-800/20">
        <button
          className={`${baseButtonClasses} ${getButtonClasses(
            !mobile,
            darkMode
          )}`}
          onClick={() => setMobile(false)}
        >
          <FontAwesomeIcon icon={faLaptop} />
          <p className="md:hidden">Desktop</p>
        </button>
        <button
          className={`${baseButtonClasses} ${getButtonClasses(
            mobile,
            darkMode
          )}`}
          onClick={() => setMobile(true)}
        >
          <FontAwesomeIcon icon={faMobileScreen} />
          <p className="md:hidden">Mobile</p>
        </button>
      </div>

      <div className="relative w-full h-full rounded-lg overflow-hidden">
        {(scale < 1 || mobile) && (
          <iframe
            src="/test3.html"
            className="rounded-lg"
            style={{
              border: "none",
              width: mobile ? "430px" : "1440px",
              transform: `scale(${scale})`,
              height: "100vh",
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
