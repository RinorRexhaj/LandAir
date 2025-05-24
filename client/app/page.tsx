"use client";
import { useEffect } from "react";
import Features from "./components/home/Features";
import Footer from "./components/home/Footer";
import GetStarted from "./components/home/GetStarted";
import Hero from "./components/home/Hero";
import HowItWorks from "./components/home/HowItWorks";
import Pricing from "./components/home/Pricing";
import Navbar from "./components/Navbar";

const Home = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-items-center font-[family-name:var(--font-inter-sans)]">
      <Navbar />
      <main className="flex flex-col w-full">
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
