import React, { useState, useEffect } from "react";
import AccountModal from "./AccountModal";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import CreditsDisplay from "./CreditsDisplay";

interface DashboardNavbarProps {
  userName: string;
  userEmail: string;
  darkMode: boolean;
  setDarkMode: (theme: boolean) => void;
  image?: string;
  credits?: number;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  userName,
  userEmail,
  image,
  credits = 5,
  darkMode,
  setDarkMode,
}) => {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  useEffect(() => {
    // Check system preference on mount
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(isDark);

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [setDarkMode]);

  const toggleTheme = () => {
    // When manually toggling, we want to override the system preference
    setDarkMode(!darkMode);
  };

  return (
    <>
      <nav
        className={`w-full ${
          darkMode
            ? "bg-zinc-900 border-white/10"
            : "bg-white border-zinc-900/10"
        } backdrop-blur-md border-b`}
      >
        <div className="w-full py-2 px-8">
          <div className="flex items-center justify-between">
            {/* Left side - Brand and Navigation */}
            <div className="flex items-center gap-8">
              {/* Brand */}
              <h1
                className={`text-2xl font-semibold ${
                  darkMode ? "text-white" : "text-zinc-900"
                }`}
              >
                LandAir
              </h1>
            </div>

            {/* Right side - User and Sign Out */}
            <div className="flex items-center gap-4">
              <CreditsDisplay credits={credits} />
              <ThemeToggle isDark={darkMode} onToggle={toggleTheme} />
              <button
                onClick={() => setIsAccountModalOpen(true)}
                className={`flex items-center gap-3 px-4 py-1.5 rounded-lg ${
                  darkMode ? "hover:bg-white/5" : "hover:bg-zinc-400/20"
                } transition-colors group`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white/5">
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
                      className={`w-full h-full flex items-center justify-center text-sm ${
                        darkMode ? "text-gray-400" : "text-zinc-800"
                      }`}
                    >
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span
                  className={`${
                    darkMode
                      ? "text-gray-400 hover group-hover:text-white"
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
        darkMode={darkMode}
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        userName={userName}
        userEmail={userEmail}
        userImage={image}
      />
    </>
  );
};

export default DashboardNavbar;
