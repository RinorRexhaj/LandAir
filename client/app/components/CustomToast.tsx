import React from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useThemeStore } from "../store/useThemeStore";

interface CustomToastProps {
  icon: IconDefinition;
  message: string;
  type?: "success" | "error" | "info" | "warning";
}

const CustomToast: React.FC<CustomToastProps> = ({ icon, message }) => {
  const { darkMode } = useThemeStore();
  return (
    <div
      className={`flex w-full max-w-sm z-50 h-full ${
        darkMode ? "bg-zinc-900 text-white" : "bg-white text-zinc-900"
      } items-center gap-2 p-2`}
    >
      <FontAwesomeIcon icon={icon} className="text-xl" />
      <div className="text-sm">{message}</div>
    </div>
  );
};

export default CustomToast;
