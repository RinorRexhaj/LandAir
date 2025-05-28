"use client";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";
import { useRouter } from "next/navigation";
import DashboardNavbar from "../dashboard/navbar/DashboardNavbar";
import DashboardSidebar from "../dashboard/DashboardSidebar";
import { useThemeStore } from "../store/useThemeStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

      <div className="flex h-full">
        <DashboardSidebar />
        <main className="flex-1 px-7 py-6 md:p-4">{children}</main>
      </div>
    </div>
  );
}
