import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faLayerGroup,
  faChartLine,
  faCog,
  faCreditCard,
  faQuestionCircle,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

interface NavItem {
  name: string;
  icon: IconDefinition;
}

interface DashboardSidebarProps {
  darkMode: boolean;
}

const navItems: NavItem[] = [
  { name: "Overview", icon: faHome },
  { name: "Projects", icon: faLayerGroup },
  { name: "Analytics", icon: faChartLine },
  { name: "Billing", icon: faCreditCard },
  { name: "Settings", icon: faCog },
  { name: "Help", icon: faQuestionCircle },
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ darkMode }) => {
  const [activeLink, setActiveLink] = useState(0);

  return (
    <aside
      className={`w-52 border-r ${
        darkMode ? "border-white/10" : "border-zinc-900/10"
      } p-6`}
      style={{
        height: "calc(100% - 56px)",
      }}
    >
      <nav className="space-y-1">
        {navItems.map((item, index) => (
          <button
            key={item.name}
            onClick={() => setActiveLink(index)}
            className={`w-40 flex items-center gap-3.5 px-4 py-2 rounded-lg transition-colors group ${
              index === activeLink
                ? darkMode
                  ? "text-white bg-white/5"
                  : "text-zinc-900 bg-zinc-200"
                : darkMode
                ? "text-gray-400 hover:text-white hover:bg-white/5"
                : "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
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
