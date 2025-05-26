"use client";
import { useEffect } from "react";
import Background from "./components/home/Background";
import Features from "./components/home/Features";
import Footer from "./components/home/Footer";
import GetStarted from "./components/home/GetStarted";
import Hero from "./components/home/Hero";
import HowItWorks from "./components/home/HowItWorks";
import Pricing from "./components/home/Pricing";
import Navbar from "./components/Navbar";
import useAuth from "./hooks/useAuth";
import { useRouter } from "next/navigation";
import Loading from "./components/Loading";

const Home = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [router, user]);

  if (loading) return <Loading />;

  return (
    <div className="relative flex flex-col items-center justify-items-center font-[family-name:var(--font-dm-sans)] tracking-tighter">
      <Navbar />
      <main className="relative flex flex-col w-full">
        <Background />

        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <Features />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Pricing Section */}
        <Pricing />

        {/* Get Started Section */}
        <GetStarted />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default Home;
