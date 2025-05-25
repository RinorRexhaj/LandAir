import React from "react";

const Loading = () => {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center gap-6 bg-zinc-900">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 rounded-full border-4 border-blue-600/30 animate-spin-2" />
        {/* Inner ring */}
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin-3" />
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 animate-pulse" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Loading</h2>
        <p className="text-gray-400 animate-analyzing">
          Please wait while we prepare your content...
        </p>
      </div>
    </div>
  );
};

export default Loading;
