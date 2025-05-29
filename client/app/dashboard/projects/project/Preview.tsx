import { useThemeStore } from "@/app/store/useThemeStore";
import { baseButtonClasses, getButtonClasses } from "@/app/utils/ButtonClasses";
import { faLaptop, faMobileScreen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const Preview = () => {
  const [mobile, setMobile] = useState(false);
  const { darkMode } = useThemeStore();

  return (
    <div className="w-full h-full flex flex-col gap-4">
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

      <div className="w-full h-full rounded-lg overflow-hidden">
        <div
          className="flex justify-center"
          style={{
            height: "100%",
            width: mobile ? "430px" : "100%",
            maxWidth: mobile ? "430px" : "1280px",
          }}
        >
          <iframe
            src="/test.html"
            style={{
              border: "none",
              height: "100%",
              width: mobile ? "430px" : "100%",
              maxWidth: mobile ? "430px" : "1280px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Preview;
