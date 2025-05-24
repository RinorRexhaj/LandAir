import React from "react";

const Hero = () => {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center text-center gap-6 px-20 md:px-8"
    >
      <h1 className="text-5xl font-bold text-white md:text-4xl">
        Create Websites with AI Magic
      </h1>
      <p className="text-xl text-gray-300/80 max-w-2xl">
        Transform your ideas into stunning, responsive pages in minutes. Just
        describe what you want, and let our AI do the rest.
      </p>
      <button className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-800 transition-colors shadow-lg hover:shadow-xl">
        Try it Now
      </button>
    </section>
  );
};

export default Hero;
