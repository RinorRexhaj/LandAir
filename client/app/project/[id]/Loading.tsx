import { useThemeStore } from "@/app/store/useThemeStore";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Loading = () => {
  const { darkMode } = useThemeStore();
  return (
    <div className="col-span-full flex flex-col items-center justify-center h-3/4 py-20 px-4 rounded-xl animate-fade">
      <FontAwesomeIcon
        icon={faGear}
        className={`w-12 h-12 mb-4 ${
          darkMode ? "text-zinc-400" : "text-gray-800"
        }`}
        spin
      />
      <h3
        className={`text-lg font-medium mb-2 ${
          darkMode ? "text-white" : "text-zinc-900"
        }`}
      >
        Loading...
      </h3>
    </div>
  );
};

export default Loading;
