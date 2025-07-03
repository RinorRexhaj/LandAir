import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faChartLine,
  faCog,
  faCreditCard,
  faQuestionCircle,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { useThemeStore } from "../store/useThemeStore";
import { useProjectStore } from "../store/useProjectsStore";

interface NavItem {
  name: string;
  icon: IconDefinition;
}

interface DashboardSidebarProps {
  activeLink: number;
  setActiveLink: (link: number) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const navItems: NavItem[] = [
  { name: "Projects", icon: faLayerGroup },
  { name: "Analytics", icon: faChartLine },
  { name: "Billing", icon: faCreditCard },
  { name: "Settings", icon: faCog },
  { name: "Help", icon: faQuestionCircle },
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeLink,
  setActiveLink,
  isOpen,
  setIsOpen,
}) => {
  const { darkMode } = useThemeStore();
  const { setSelectedProject } = useProjectStore();

  return (
    <aside
      className={`fixed top-[49px] left-0 h-[calc(100vh-48px)] transition-all z-40 duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } w-48 md:w-40 border-r ${
        darkMode ? "border-white/10 bg-zinc-900" : "border-zinc-900/10 bg-white"
      } px-5 py-6 md:p-4`}
    >
      <nav className="space-y-1.5 flex flex-col items-center">
        {navItems.map((item, index) => (
          <button
            key={item.name}
            onClick={() => {
              setActiveLink(index);
              setSelectedProject(null);
              setIsOpen(false);
            }}
            className={`w-40 md:w-32 flex items-center text-sm gap-3.5 px-4 py-2 rounded-lg transition-colors group ${
              index === activeLink
                ? darkMode
                  ? "text-white bg-white/5"
                  : "text-zinc-900 bg-zinc-200"
                : darkMode
                ? "text-gray-400 hover:text-white hover:bg-white/5"
                : "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"
            } animate-slideIn [animation-fill-mode:backwards]`}
            style={{
              animationDelay: `${index * 0.05}s`,
            }}
          >
            <FontAwesomeIcon
              icon={item.icon}
              className={`w-5 h-5 ${
                darkMode
                  ? "group-hover:text-white"
                  : "group-hover:text-zinc-900"
              } transition-colors`}
            />
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
