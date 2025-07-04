"use client";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";
import { useRouter } from "next/navigation";
import DashboardNavbar from "../components/navbar/DashboardNavbar";
import Projects from "./projects/Projects";
import { useThemeStore } from "../store/useThemeStore";
import { ToastContainer } from "react-toastify";
import Templates from "./Templates";
import { useProjectStore } from "../store/useProjectsStore";

const Dashboard = () => {
  // const [activeLink, setActiveLink] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const { selectedProject } = useProjectStore();
  const { darkMode } = useThemeStore();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (!isClient || loading) return <Loading />;

  const safeUserName = user?.user_metadata?.name ?? "User";
  const safeUserEmail = user?.email ?? "";
  const safeUserImage =
    user?.identities?.[0]?.identity_data?.picture ?? undefined;

  return (
    <div
      className={`h-screen overflow-hidden ${
        darkMode ? "bg-zinc-900" : "bg-white"
      } transition-colors`}
    >
      <DashboardNavbar
        userName={safeUserName}
        userEmail={safeUserEmail}
        image={safeUserImage}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div
        className="absolute w-full flex"
        style={{
          top: "40px",
          height: "calc(100vh - 40px)",
        }}
      >
        {/* <DashboardSidebar
          activeLink={activeLink}
          setActiveLink={setActiveLink}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        /> */}
        <ToastContainer closeOnClick hideProgressBar icon={false} limit={3} />
        <main
          className={`flex flex-col gap-8 flex-1 ${
            selectedProject ? "px-4" : "px-8"
          } py-6 md:p-4`}
        >
          <Projects />
          {!loading && !selectedProject && <Templates />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
