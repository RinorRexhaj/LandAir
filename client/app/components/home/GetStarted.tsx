import React from "react";

const GetStarted = () => {
  return (
    <section
      id="get-started"
      className="min-h-screen flex flex-col items-center justify-center gap-8 px-20 md:px-8"
    >
      <h2 className="text-5xl md:text-4xl text-center font-bold">
        Get Started Today
      </h2>
      <p className="text-xl md:text-lg text-center text-gray-300/80 max-w-2xl">
        Join creators already using LandAir to grow their TikTok presence faster.
      </p>
      <a
        href="mailto:rinorrexhaj10@gmail.com"
        className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-800 transition-colors shadow-lg hover:shadow-xl"
      >
        Get in Touch
      </a>
      <p className="text-center text-gray-300/80">
        Questions? Reach us at{" "}
        <a
          href="mailto:rinorrexhaj10@gmail.com"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          rinorrexhaj10@gmail.com
        </a>
      </p>
    </section>
  );
};

export default GetStarted;
