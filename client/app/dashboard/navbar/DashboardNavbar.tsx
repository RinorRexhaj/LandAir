import React, { useState, useEffect } from "react";
import AccountModal from "./AccountModal";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import CreditsDisplay from "./CreditsDisplay";
import { useThemeStore } from "@/app/store/useThemeStore";

interface DashboardNavbarProps {
  userName: string;
  userEmail: string;
  image?: string;
  credits?: number;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  userName,
  userEmail,
  image,
  credits = 5,
}) => {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
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
        className={`w-full ${
          darkMode
            ? "bg-zinc-900 border-white/10"
            : "bg-white border-zinc-900/10"
        } backdrop-blur-md border-b`}
      >
        <div className="w-full py-2 px-8 md:px-4">
          <div className="flex items-center justify-between">
            {/* Left side - Brand and Navigation */}
            <div className="flex items-center gap-8">
              {/* Brand */}
              <h1
                className={`text-2xl overflow-hidden font-semibold ${
                  darkMode ? "text-white" : "text-zinc-900"
                }`}
              >
                {"LandAir".split("").map((char, index) => (
                  <span
                    className="animate-textReveal [animation-fill-mode:backwards]"
                    style={{ animationDelay: `${index * 0.03}s` }}
                    key={`${char}-${index}`}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </h1>
            </div>

            {/* Right side - User and Sign Out */}
            <div className="flex items-center gap-2.5 md:gap-1">
              <CreditsDisplay darkMode={darkMode} credits={credits} />
              <ThemeToggle />
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
                        darkMode ? "text-gray-300" : "text-zinc-800"
                      }`}
                    >
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span
                  className={`md:hidden ${
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
    </>
  );
};

export default DashboardNavbar;
