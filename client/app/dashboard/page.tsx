"use client";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";
import { useRouter } from "next/navigation";
import DashboardNavbar from "./navbar/DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import Projects from "./projects/Projects";
import { useThemeStore } from "../store/useThemeStore";

const Dashboard = () => {
  const [activeLink, setActiveLink] = useState(0);
  const { user, loading } = useAuth();
  const router = useRouter();
  const { darkMode } = useThemeStore();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  const getComponent = () => {
    switch (activeLink) {
      case 0:
        return <Projects />;
      // case 1: return <Projects />
      // case 2: return <Analytics />
      // case 3: return <Billing />
      // case 4: return <Settings />
      // case 5: return <Help />
      default:
        return <Projects />;
    }
  };

  if (loading) return <Loading />;

  return (
    <div
      className={`h-screen overflow-hidden ${
        darkMode ? "bg-zinc-900" : "bg-white"
      } transition-colors`}
    >
      <DashboardNavbar
        userName={user?.user_metadata?.name || "User"}
        userEmail={user?.email || ""}
        image={user?.identities?.[0]?.identity_data?.picture}
        credits={5}
      />

      <div className="flex h-full">
        <DashboardSidebar
          activeLink={activeLink}
          setActiveLink={setActiveLink}
        />

        <main className="flex-1 px-8 py-6 md:p-4">{getComponent()}</main>
      </div>
    </div>
  );
};

export default Dashboard;
