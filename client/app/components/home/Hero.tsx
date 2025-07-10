import { faRocket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const suggestions = ["Portfolio", "SaaS", "Blog", "E-commerce", "Agency"];

const Hero = () => {
  const [prompt, setPrompt] = useState("");

  return (
    <section
      id="hero"
      className="min-h-dvh flex flex-col items-center justify-center text-center gap-6 px-20 md:px-8"
    >
      <h1
        className="text-5xl md:hidden font-bold text-white flex overflow-hidden"
        style={{
          animationDelay: "0.5s",
        }}
      >
        {"Create Websites with AI Magic".split("").map((char, index) => (
          <span
            className="animate-textReveal [animation-fill-mode:backwards]"
            style={{ animationDelay: `${index * 0.03}s` }}
            key={`${char}-${index}`}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>
      <div className="hidden md:flex flex-col items-center">
        <h1
          className="hidden md:flex text-4xl font-bold text-white overflow-hidden"
          style={{
            animationDelay: "0.5s",
          }}
        >
          {"Create Websites".split("").map((char, index) => (
            <span
              className="animate-textReveal [animation-fill-mode:backwards]"
              style={{
                animationDelay: `${index * 0.03}s`,
              }}
              key={`${char}-${index}`}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
        <h1
          className="hidden md:flex text-4xl font-bold text-white overflow-hidden"
          style={{
            animationDelay: "0.5s",
          }}
        >
          {"with AI Magic".split("").map((char, index) => (
            <span
              className="animate-textReveal [animation-fill-mode:backwards]"
              style={{
                animationDelay: `${index * 0.03 + 0.3}s`,
                marginBottom: `${char === "g" ? "5px" : "0"}px`,
              }}
              key={`${char}-${index}`}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
      </div>
      <p
        className="text-lg text-white/80 max-w-2xl animate-slideIn [animation-fill-mode:backwards]"
        style={{ animationDelay: "0.7s" }}
      >
        Transform your ideas into stunning, responsive pages in minutes. Just
        describe what you want, and let our AI do the rest.
      </p>
      {/* Glassmorphic Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          window.location.href = "/sign-up";
        }}
        className="w-full max-w-xl animate-fade-in-slow [animation-fill-mode:backwards]"
        style={{ animationDelay: "1s" }}
      >
        <div className="flex flex-row gap-0 bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl overflow-hidden">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your landing page idea..."
            className="flex-1 px-6 py-4 bg-transparent text-white placeholder-white/60 focus:outline-none text-base md:text-sm"
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-4 md:px-6 bg-blue-600/80 hover:bg-blue-700/90 text-white font-semibold transition-colors rounded-none justify-center"
          >
            <p className="md:hidden">Generate Now</p>
            <FontAwesomeIcon icon={faRocket} className="hidden md:block" />
          </button>
        </div>
        {/* Suggestion Buttons BELOW input */}
        <div
          className="flex flex-wrap gap-1 justify-center mt-2 animate-fade-in-slow [animation-fill-mode:backwards]"
          style={{ animationDelay: "1.1s" }}
        >
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              className="px-2 py-1 rounded-full bg-white/20 text-white/90 backdrop-blur border border-white/30 shadow-sm hover:bg-white/30 transition-colors text-xs font-medium"
              onClick={() => setPrompt(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </form>
    </section>
  );
};

export default Hero;
