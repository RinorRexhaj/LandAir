import {
  faChartColumn,
  faClone,
  faMusic,
  faPaperPlane,
  faScissors,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const features = [
  {
    title: "Intuitive Video Editing",
    description:
      "Trim, cut, merge, and layer clips with a clean editor designed for speed. Add text overlays, transitions, and effects without a learning curve.",
    icon: faScissors,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    title: "Audio & Music Tools",
    description:
      "Sync your video to music, adjust audio levels, and add voiceovers — everything you need to make content that stands out in the feed.",
    icon: faMusic,
    gradient: "from-violet-500 to-violet-600",
  },
  {
    title: "Direct TikTok Posting",
    description:
      "Connect your TikTok account and publish videos directly from LandAir using TikTok's official Content Posting API. No downloading, no re-uploading — just one click to go live.",
    icon: faPaperPlane,
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    title: "Templates & Formats",
    description:
      "Start from professionally designed templates optimized for TikTok's vertical format. Save your own templates for consistent branding.",
    icon: faClone,
    gradient: "from-purple-500 to-purple-600",
  },
  {
    title: "Post Management",
    description:
      "Schedule posts, track what's been published, and manage your TikTok content history — all from a single dashboard.",
    icon: faChartColumn,
    gradient: "from-pink-500 to-rose-600",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="min-h-screen flex flex-col items-center justify-center gap-12 px-20 md:px-8 py-24 md:py-16"
    >
      <div className="text-center">
        <h2 className="text-5xl md:text-4xl font-bold mb-4">
          Powerful Features
        </h2>
        <p className="text-lg text-gray-300/80 max-w-2xl">
          Everything you need to create and post — without the friction
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-8 w-full max-w-7xl">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative w-80 md:w-full p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl" />
            <div
              className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6`}
            >
              <FontAwesomeIcon
                icon={feature.icon}
                className="w-7 h-7 text-white"
              />
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
