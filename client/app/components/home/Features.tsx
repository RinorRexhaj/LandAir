import React from "react";

const Features = () => {
  return (
    <section
      id="features"
      className="min-h-screen flex flex-col items-center justify-center gap-12 px-20 md:px-8 md:mb-32"
    >
      <div className="text-center">
        <h2 className="text-5xl md:text-4xl font-bold mb-4">
          Powerful Features
        </h2>
        <p className="text-lg text-gray-300/80">
          Everything you need to create the perfect landing page
        </p>
      </div>
      <div className="grid grid-cols-3 gap-8 w-full max-w-7xl md:grid-cols-1">
        {[
          {
            title: "AI-Powered Generation",
            description:
              "Simply describe your vision, and our AI creates a professional landing page tailored to your needs.",
            icon: (
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            ),
            gradient: "from-blue-500 to-blue-600",
          },
          {
            title: "Responsive Design",
            description:
              "Every page is automatically optimized for all devices, from mobile to desktop.",
            icon: (
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            ),
            gradient: "from-violet-500 to-violet-600",
          },
          {
            title: "Instant Deployment",
            description:
              "One-click deployment to your custom domain with automatic SSL and SEO features.",
            icon: (
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            ),
            gradient: "from-purple-500 to-purple-600",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl" />
            <div
              className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6`}
            >
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">
              {feature.title}
            </h3>
            <p className="text-gray-300/80 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
