import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center text-center gap-6 px-20 md:px-8"
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
              style={{ animationDelay: `${index * 0.03}s` }}
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
              style={{ animationDelay: `${index * 0.03 + 0.3}s` }}
              key={`${char}-${index}`}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
      </div>
      <p
        className="text-xl text-white/80 max-w-2xl animate-slideIn [animation-fill-mode:backwards]"
        style={{ animationDelay: "0.7s" }}
      >
        Transform your ideas into stunning, responsive pages in minutes. Just
        describe what you want, and let our AI do the rest.
      </p>
      <Link
        href={"/sign-up"}
        className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-800 transition-colors shadow-lg animate-fade-in-slow [animation-fill-mode:backwards] hover:shadow-xl"
        style={{ animationDelay: "1s" }}
      >
        Try it Now
      </Link>
    </section>
  );
};

export default Hero;
