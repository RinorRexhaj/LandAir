import React from "react";

const steps = [
  {
    step: "1",
    title: "Create",
    description:
      "Upload your footage or start from a template. Use LandAir's editor to cut, caption, and stylize your video.",
  },
  {
    step: "2",
    title: "Refine",
    description:
      "Preview your content exactly as it will appear on TikTok. Make last-minute adjustments with a single click.",
  },
  {
    step: "3",
    title: "Post",
    description:
      "Hit publish and LandAir sends your video directly to TikTok via the official Content Posting API. Your content goes live instantly — or on a schedule you choose.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="min-h-screen flex flex-col items-center justify-center gap-12 px-20 md:px-8 py-24 md:py-16"
    >
      <div className="text-center">
        <h2 className="text-5xl md:text-4xl font-bold mb-4">How It Works</h2>
        <p className="text-lg text-gray-300/80 max-w-2xl">
          From idea to TikTok in three simple steps
        </p>
      </div>
      <div className="grid grid-cols-3 gap-8 w-full max-w-7xl md:grid-cols-1">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold mb-4">
              {step.step}
            </div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-300/80 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
