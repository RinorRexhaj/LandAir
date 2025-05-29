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

interface NavItem {
  name: string;
  icon: IconDefinition;
}

interface DashboardSidebarProps {
  activeLink: number;
  setActiveLink: (link: number) => void;
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
}) => {
  const { darkMode } = useThemeStore();

  return (
    <aside
      className={`w-48 md:w-14 border-r ${
        darkMode ? "border-white/10" : "border-zinc-900/10"
      } px-5 py-6 md:p-4`}
      style={{
        height: "calc(100% + 18px)",
      }}
    >
      <nav className="space-y-1.5 flex flex-col items-center">
        {navItems.map((item, index) => (
          <button
            key={item.name}
            onClick={() => setActiveLink(index)}
            className={`w-40 md:w-10 flex items-center md:justify-center text-sm gap-3.5 px-4 py-2 rounded-lg transition-colors group ${
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
            <span className="font-medium md:hidden">{item.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
