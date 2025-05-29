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
        credits={5}
      />

      <div
        className="absolute w-full flex"
        style={{
          top: "61px",
          height: "calc(100vh - 80px)",
        }}
      >
        <DashboardSidebar
          activeLink={activeLink}
          setActiveLink={setActiveLink}
        />
        <main className="flex-1 px-7 py-6 md:p-4">{<Projects />}</main>
      </div>
    </div>
  );
};

export default Dashboard;
