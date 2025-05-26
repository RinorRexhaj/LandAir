import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";

interface CreditsDisplayProps {
  credits: number;
  darkMode: boolean;
}

const CreditsDisplay: React.FC<CreditsDisplayProps> = ({
  credits,
  darkMode,
}) => {
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group">
      <FontAwesomeIcon
        icon={faCoins}
        className={`w-4 h-4 ${
          darkMode
            ? "text-gray-300 group-hover:text-gray-300"
            : "text-zinc-800 group-hover:text-zinc-900"
        } transition-colors`}
      />
      <span
        className={`text-sm font-medium ${
          darkMode
            ? "text-gray-300 group-hover:text-gray-300"
            : "text-zinc-800 group-hover:text-zinc-900"
        } transition-colors`}
      >
        {credits} <span className="md:hidden">Credits</span>
      </span>
    </div>
  );
};

export default CreditsDisplay;
