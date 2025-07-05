import Link from "next/link";
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
      <Link
        href={"/sign-up"}
        className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-800 transition-colors shadow-lg hover:shadow-xl"
      >
        Try it Now
      </Link>
    </section>
  );
};

export default GetStarted;
