import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import useApi from "@/app/hooks/useApi";
import { useCreditStore } from "@/app/store/useCreditStore";

interface CreditsDisplayProps {
  darkMode: boolean;
  setIsBuyCreditsModalOpen: (open: boolean) => void;
}

const CreditsDisplay: React.FC<CreditsDisplayProps> = ({
  darkMode,
  setIsBuyCreditsModalOpen,
}) => {
  const { credits, setCredits } = useCreditStore();
  const { loading, get } = useApi();

  useEffect(() => {
    const getCredits = async () => {
      const { credits }: { credits: number } = await get(`/api/credits`);
      setCredits(credits);
    };

    getCredits();
  }, [get, setCredits]);

  return (
    <div
      className="h-8 flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer animate-slideDown [animation-fill-mode:backwards]"
      style={{
        animationDelay: "0.1s",
      }}
      onClick={() => setIsBuyCreditsModalOpen(true)}
      title="Get Credits"
    >
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
        } transition-colors ${loading && "animate-glow"}`}
      >
        {!loading ? credits : ""}
        {/* <span className="md:hidden">Credits</span> */}
      </span>
    </div>
  );
};

export default CreditsDisplay;
