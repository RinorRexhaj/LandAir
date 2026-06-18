"use client";
import { useEffect } from "react";
import About from "./components/home/About";
import Background from "./components/home/Background";
import Features from "./components/home/Features";
import Footer from "./components/home/Footer";
import GetStarted from "./components/home/GetStarted";
import Hero from "./components/home/Hero";
import HowItWorks from "./components/home/HowItWorks";
import WhoItsFor from "./components/home/WhoItsFor";
import WhyLandAir from "./components/home/WhyLandAir";
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
    <div className="relative flex flex-col items-center justify-items-center font-[family-name:var(--font-inter)] tracking-tighter minimal-scrollbar">
      <Navbar />
      <main className="relative flex flex-col w-full">
        <Background />

        {/* Hero Section */}
        <Hero />

        {/* What Is LandAir Section */}
        <About />

        {/* Features Section */}
        <Features />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Who Is LandAir For Section */}
        <WhoItsFor />

        {/* Why LandAir Section */}
        <WhyLandAir />

        {/* Get Started Section */}
        <GetStarted />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default Home;
