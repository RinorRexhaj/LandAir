"use client";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { handleScroll } from "@/app/utils/Scroll";

const titleWords = ["Create.", "Edit.", "Post.", "All", "in", "One", "Place."];

const Hero = () => {
  const scrollTo = (id: string) => handleScroll(document.getElementById(id));

  return (
    <section
      id="hero"
      className="min-h-dvh flex flex-col items-center justify-center text-center gap-6 px-20 md:px-8"
    >
      {/* Trust badge */}
      <span
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm md:text-xs text-white/90 animate-fade [animation-fill-mode:backwards]"
        style={{ animationDelay: "0.3s" }}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        Powered by TikTok&apos;s official Content Posting API
      </span>

      {/* Animated title */}
      <h1 className="flex flex-wrap justify-center gap-x-4 md:gap-x-3 max-w-4xl text-6xl md:text-4xl sm:text-3xl font-bold leading-tight text-white">
        {titleWords.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="inline-flex overflow-hidden pb-1"
          >
            <span
              className="inline-block animate-textReveal [animation-fill-mode:backwards]"
              style={{ animationDelay: `${index * 0.08 + 0.2}s` }}
            >
              {word}
            </span>
          </span>
        ))}
      </h1>

      <p
        className="max-w-2xl text-lg md:text-base text-white/80 animate-slideIn [animation-fill-mode:backwards]"
        style={{ animationDelay: "0.7s" }}
      >
        LandAir is the fastest way to turn your ideas into polished
        TikTok-ready videos — and post them without ever leaving the app.
      </p>

      {/* Call to action */}
      <div
        className="flex items-center gap-4 sm:w-full sm:flex-col animate-fade-in-slow [animation-fill-mode:backwards]"
        style={{ animationDelay: "1s" }}
      >
        <button
          type="button"
          onClick={() => scrollTo("how-it-works")}
          className="flex items-center justify-center gap-2 px-8 py-4 sm:w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors shadow-lg hover:shadow-xl"
        >
          <FontAwesomeIcon icon={faPlay} className="w-3.5 h-3.5" />
          See How It Works
        </button>
      </div>
    </section>
  );
};

export default Hero;
