import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faUser,
  faSignOutAlt,
  faTimes,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../../utils/Supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useThemeStore } from "@/app/store/useThemeStore";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  userImage?: string;
}

const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  userName,
  userEmail,
  userImage,
}) => {
  const router = useRouter();
  const { darkMode } = useThemeStore();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    router.push("/");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 ${
          darkMode ? "bg-black/50" : "bg-white/5"
        } backdrop-blur-sm`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full md:w-10/12 max-w-md p-6 rounded-xl border animate-fadeFast ${
          darkMode
            ? "bg-zinc-900 border-white/10"
            : "bg-white border-zinc-700/20"
        } shadow-2xl`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 ${
            darkMode
              ? "text-gray-400 hover:text-white"
              : "text-zinc-700 hover:text-zinc-900"
          } transition-colors`}
        >
          <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
        </button>

        {/* User Info */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`w-16 h-16 rounded-full overflow-hidden ${
              darkMode ? "bg-white/5" : "bg-black/10"
            }`}
          >
            {userImage ? (
              <Image
                src={userImage}
                alt={userName}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center text-2xl ${
                  darkMode ? "text-gray-200" : "text-zinc-800"
                }`}
              >
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h2
              className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-zinc-900"
              }`}
            >
              {userName}
            </h2>
            <p className={`${darkMode ? "text-gray-400" : "text-zinc-700"}`}>
              {userEmail}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {/* <button
            className={`w-full flex items-center gap-3 px-4 py-3 ${
              darkMode
                ? "text-gray-300 hover:text-white hover:bg-white/5"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
            } rounded-lg transition-colors`}
          >
            <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
            <span>Profile Settings</span>
          </button> */}
          <div className="h-px bg-white/10 my-2" />
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 px-4 py-3 ${
              darkMode
                ? "text-red-500/90 hover:text-red-200 hover:bg-red-500/50"
                : "text-red-500/90 hover:text-gray-100 hover:bg-red-500"
            } rounded-lg font-semibold transition-colors`}
          >
            <FontAwesomeIcon
              icon={loading ? faSpinner : faSignOutAlt}
              spin={loading}
              className="w-5 h-5"
            />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
