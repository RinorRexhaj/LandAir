import React from "react";

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="min-h-screen flex flex-col items-center justify-center gap-12 px-20 md:px-8 md:mb-32"
    >
      <div className="text-center">
        <h2 className="text-5xl md:text-4xl font-bold mb-4">How It Works</h2>
        <p className="text-lg text-gray-300/80 max-w-2xl">
          Creating your landing page is as easy as 1-2-3
        </p>
      </div>
      <div className="grid grid-cols-3 gap-8 w-full max-w-7xl md:grid-cols-1">
        {[
          {
            step: "1",
            title: "Describe Your Idea",
            description:
              "Tell us about your product or service in natural language",
          },
          {
            step: "2",
            title: "Generate & Preview",
            description:
              "Our AI creates your page and lets you preview it instantly",
          },
          {
            step: "3",
            title: "Deploy Instantly",
            description: "One click to deploy your page to the world",
          },
        ].map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold mb-4">
              {step.step}
            </div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-300/80">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
