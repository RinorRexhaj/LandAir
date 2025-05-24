import React from "react";

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="min-h-screen flex flex-col items-center justify-center gap-12 px-20 md:px-8"
    >
      <div className="text-center">
        <h2 className="text-5xl md:text-4xl font-bold mb-4">
          Simple Credit-Based Pricing
        </h2>
        <p className="text-lg text-gray-300/80">
          Choose the credit bundle that fits your needs
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-8 w-full max-w-7xl md:grid-cols-1">
        {[
          {
            name: "Starter",
            credits: "5 Credits",
            price: "Free",
            features: [
              "Build 1 Landing Page",
              "Basic Templates",
              "Valid for 30 days",
            ],
            isPremium: false,
          },
          {
            name: "Growth",
            credits: "15 Credits",
            price: "$4.99",
            features: [
              "More customization",
              "Premium Templates",
              "Valid for 90 days",
            ],
            isPremium: "Popular",
          },
          {
            name: "Scale",
            credits: "35 Credits",
            price: "$10.99",
            features: [
              "All in one",
              "All Premium Templates",
              "Valid for 180 days",
            ],
            isPremium: "Premium",
          },
        ].map((plan, index) => (
          <div
            key={index}
            className={`relative w-72 p-8 rounded-xl backdrop-blur-md ${
              index === 1
                ? "bg-blue-600/20 border border-blue-500/30"
                : index === 2
                ? "bg-violet-700/20 border border-violet-500/30"
                : "bg-white/10 border border-white/20"
            } shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <div className="flex items-center gap-4 mb-2">
              <h3 className="text-2xl font-bold">{plan.name} </h3>
              {plan.isPremium && (
                <div className="">
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold ${
                      index === 1
                        ? "bg-blue-600 text-white"
                        : "bg-violet-700 text-white"
                    }`}
                  >
                    {plan.isPremium}
                  </span>
                </div>
              )}
            </div>

            <p className="text-sm font-medium mb-1">{plan.credits}</p>
            <p className="text-3xl font-bold mb-6">
              {plan.price}
              {plan.price !== "Free" && (
                <span className="text-sm font-normal">/bundle</span>
              )}
            </p>
            <ul className="space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center text-wrap">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                window.location.href = "/sign-up";
              }}
              className={`w-full mt-8 py-3 rounded-full font-semibold backdrop-blur-sm ${
                index === 1
                  ? "bg-blue-600 hover:bg-blue-700"
                  : index === 2
                  ? "bg-violet-600 hover:bg-violet-700"
                  : "bg-gray-600 hover:bg-gray-700"
              } transition-all duration-300`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
