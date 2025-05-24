import React from "react";

const GetStarted = () => {
  return (
    <section
      id="get-started"
      className="min-h-screen flex flex-col items-center justify-center gap-8 px-20 md:px-8"
    >
      <h2 className="text-5xl md:text-4xl text-center font-bold">
        Ready to Create Your Landing Page?
      </h2>
      <p className="text-xl text-center text-gray-300/80 max-w-2xl">
        Join thousands of founders and marketers who are creating stunning
        landing pages in minutes.
      </p>
      <div className="flex flex-row gap-4 w-full max-w-xl md:flex-col">
        <input
          type="text"
          placeholder="Describe your landing page idea..."
          className="flex-1 px-6 py-4 rounded-full border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors">
          Generate Now
        </button>
      </div>
    </section>
  );
};

export default GetStarted;
