import {
  faBriefcase,
  faGlobe,
  faUsers,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const audiences = [
  {
    title: "Content Creators",
    description: "Who want to produce more without slowing down.",
    icon: faVideo,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    title: "Brands & Businesses",
    description: "Building a presence on TikTok.",
    icon: faBriefcase,
    gradient: "from-violet-500 to-violet-600",
  },
  {
    title: "Social Media Managers",
    description: "Handling multiple accounts and deadlines.",
    icon: faUsers,
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    title: "Anyone",
    description:
      "Who wants their TikTok content to look polished and professional.",
    icon: faGlobe,
    gradient: "from-pink-500 to-rose-600",
  },
];

const WhoItsFor = () => {
  return (
    <section
      id="who-its-for"
      className="flex flex-col items-center justify-center gap-12 px-20 md:px-8 py-24 md:py-16"
    >
      <div className="text-center">
        <h2 className="text-5xl md:text-4xl font-bold mb-4">
          Who Is LandAir For?
        </h2>
        <p className="text-lg text-gray-300/80 max-w-2xl">
          Built for everyone serious about growing on TikTok
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-1 gap-8 w-full max-w-5xl">
        {audiences.map((audience, index) => (
          <div
            key={index}
            className="flex items-start gap-5 p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div
              className={`shrink-0 inline-flex p-3 rounded-xl bg-gradient-to-br ${audience.gradient}`}
            >
              <FontAwesomeIcon
                icon={audience.icon}
                className="w-6 h-6 text-white"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                {audience.title}
              </h3>
              <p className="text-gray-300/80 leading-relaxed">
                {audience.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhoItsFor;
