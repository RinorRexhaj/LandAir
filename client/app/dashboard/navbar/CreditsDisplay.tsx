import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";

interface CreditsDisplayProps {
  credits: number;
}

const CreditsDisplay: React.FC<CreditsDisplayProps> = ({ credits }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group">
      <FontAwesomeIcon
        icon={faCoins}
        className="w-4 h-4 text-yellow-400 group-hover:text-yellow-300 transition-colors"
      />
      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
        {credits} Credits
      </span>
    </div>
  );
};

export default CreditsDisplay;
