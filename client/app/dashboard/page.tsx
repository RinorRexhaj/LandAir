"use client";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";
import { useRouter } from "next/navigation";
import DashboardNavbar from "./navbar/DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

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
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div className="flex h-full">
        <DashboardSidebar darkMode={darkMode} />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Main Content */}
              <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Recent Projects
                  </h2>
                  <p className="text-gray-400">
                    No projects yet. Create your first landing page!
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Quick Actions
                  </h2>
                  <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                    Create New Project
                  </button>
                </div>

                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Account Stats
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400">Projects Created</p>
                      <p className="text-2xl font-bold text-white">0</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
