import React, { useState, useEffect } from "react";
import AccountModal from "./AccountModal";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import CreditsDisplay from "./CreditsDisplay";
import { useThemeStore } from "@/app/store/useThemeStore";
import BuyCreditsModal from "./BuyCreditsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faWindowRestore } from "@fortawesome/free-solid-svg-icons";

interface DashboardNavbarProps {
  userName: string;
  userEmail: string;
  image?: string;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  userName,
  userEmail,
  image,
  toggleSidebar,
  isSidebarOpen,
}) => {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isBuyCreditsModalOpen, setIsBuyCreditsModalOpen] = useState(false);
  const { darkMode, setDarkMode } = useThemeStore();

  useEffect(() => {
    // Check system preference
    let isDark = localStorage.getItem("theme");
    if (isDark === null) {
      localStorage.setItem("theme", "dark");
      isDark = "dark";
    }
    setDarkMode(isDark === "dark");
  }, [setDarkMode]);

  return (
    <>
      <nav
        className={`fixed top-0 w-full ${
          darkMode
            ? "bg-zinc-900 border-white/10"
            : "bg-white border-zinc-900/10"
        } backdrop-blur-md border-b`}
      >
        <div className="w-full py-1.5 px-6 md:px-4">
          <div className="flex items-center justify-between">
            {/* Left side - Brand and Navigation */}
            <div className="flex items-center gap-2">
              {/* Menu Button */}
              <button
                onClick={toggleSidebar}
                className={`p-2 md:-ml-2 mt-0.5 flex items-center justify-center rounded-lg ${
                  darkMode ? "hover:bg-white/5" : "hover:bg-zinc-400/20"
                } transition-colors`}
                title="Toggle Menu"
              >
                <FontAwesomeIcon
                  icon={isSidebarOpen ? faWindowRestore : faBars}
                  className={`w-4 h-4 ${
                    darkMode ? "text-white" : "text-zinc-900"
                  }`}
                />
              </button>
              {/* Brand */}
              <h1
                className={`text-xl overflow-hidden font-bold ${
                  darkMode ? "text-white" : "text-zinc-900"
                } animate-fade`}
              >
                LandAir
              </h1>
            </div>

            {/* Right side - User and Sign Out */}
            <div className="flex items-center gap-2.5 md:gap-1">
              <CreditsDisplay
                darkMode={darkMode}
                setIsBuyCreditsModalOpen={setIsBuyCreditsModalOpen}
              />
              <ThemeToggle />
              <button
                onClick={() => setIsAccountModalOpen(true)}
                className={`flex items-center gap-2 px-2.5 py-1 md:px-1.5 rounded-lg ${
                  darkMode ? "hover:bg-white/5" : "hover:bg-zinc-400/20"
                } transition-colors animate-slideDown [animation-fill-mode:backwards]`}
                style={{ animationDelay: "0.3s" }}
                title="Account"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden bg-white/5">
                  {image ? (
                    <Image
                      src={image}
                      alt={userName}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full max-w-48 h-full flex items-center rounded-full font-semibold justify-center text-sm  truncate ${
                        darkMode
                          ? "text-gray-300 bg-white/5"
                          : "text-zinc-800 bg-black/10"
                      }`}
                    >
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span
                  className={`md:hidden font-medium ${
                    darkMode
                      ? "text-gray-300 hover group-hover:text-white"
                      : "text-zinc-900"
                  } transition-colors`}
                >
                  {userName}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        userName={userName}
        userEmail={userEmail}
        userImage={image}
      />
      <BuyCreditsModal
        isOpen={isBuyCreditsModalOpen}
        onClose={() => setIsBuyCreditsModalOpen(false)}
      />
    </>
  );
};

export default DashboardNavbar;
