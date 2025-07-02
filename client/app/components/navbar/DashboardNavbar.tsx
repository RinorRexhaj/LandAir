import React, { useState, useEffect } from "react";
import AccountModal from "./AccountModal";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import CreditsDisplay from "./CreditsDisplay";
import { useThemeStore } from "@/app/store/useThemeStore";
import BuyCreditsModal from "./BuyCreditsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faWindowRestore } from "@fortawesome/free-solid-svg-icons";
import { useProjectStore } from "@/app/store/useProjectsStore";
import NameModal from "./NameModal";
import ProjectHeader from "./ProjectHeader";
import DeployModal from "./DeployModal";
import SettingsModal from "./SettingsModal";

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
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const { selectedProject } = useProjectStore();
  const { darkMode, setDarkMode } = useThemeStore();
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);

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
        <div className="w-full py-1.5 px-4">
          <div className="flex items-center justify-between">
            {/* Left side - Brand and Navigation */}
            <div className="flex items-center gap-2 sm:gap-0">
              {/* Menu Button */}
              <button
                onClick={toggleSidebar}
                className={`p-2 sm:-ml-1 mt-0.5 flex items-center justify-center rounded-lg ${
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
                } animate-fade cursor-pointer flex items-center gap-2`}
                onClick={() => {
                  if (selectedProject) {
                    setIsEditNameModalOpen(true);
                  }
                }}
                title="Edit project name"
              >
                {selectedProject ? selectedProject.project_name : "LandAir"}
              </h1>
            </div>

            {/* Right side - User and Sign Out */}
            <div className="flex items-center gap-2 md:gap-1">
              <CreditsDisplay
                darkMode={darkMode}
                setIsBuyCreditsModalOpen={setIsBuyCreditsModalOpen}
              />
              <ProjectHeader
                setShowDeployModal={setShowDeployModal}
                setShowSettingsModal={setShowSettingsModal}
              />
              <ThemeToggle />
              <button
                onClick={() => setIsAccountModalOpen(true)}
                className={`flex items-center gap-2 rounded-md animate-slideDown [animation-fill-mode:backwards]`}
                style={{ animationDelay: "0.3s" }}
                title="Account"
              >
                <div
                  className={`w-8 h-8 overflow-hidden bg-white/5 ${
                    image ? "rounded-full" : "rounded-md"
                  }`}
                >
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
                      className={`w-full max-w-48 h-full flex items-center rounded-md font-semibold justify-center text-sm  truncate ${
                        darkMode
                          ? "text-gray-300 bg-white/5 hover:bg-white/10"
                          : "text-zinc-800 bg-black/10 hover:bg-black/20"
                      }`}
                    >
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                {/* <span
                  className={`md:hidden font-medium ${
                    darkMode
                      ? "text-gray-300 hover group-hover:text-white"
                      : "text-zinc-900"
                  } transition-colors`}
                >
                  {userName}
                </span> */}
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
      {isBuyCreditsModalOpen && (
        <BuyCreditsModal
          isOpen={isBuyCreditsModalOpen}
          onClose={() => setIsBuyCreditsModalOpen(false)}
        />
      )}
      {showDeployModal && (
        <DeployModal
          isOpen={showDeployModal}
          setShowDeployModal={setShowDeployModal}
        />
      )}

      {showSettingsModal && (
        <SettingsModal setShowSettingsModal={setShowSettingsModal} />
      )}

      {isEditNameModalOpen && (
        <NameModal setIsEditNameModalOpen={setIsEditNameModalOpen} />
      )}
    </>
  );
};

export default DashboardNavbar;
