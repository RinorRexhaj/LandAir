import React from "react";

const About = () => {
  return (
    <section
      id="about"
      className="flex flex-col items-center justify-center text-center gap-6 px-20 md:px-8 py-24 md:py-16"
    >
      <h2 className="text-4xl md:text-3xl font-bold text-white max-w-3xl">
        What Is LandAir?
      </h2>
      <p className="text-lg md:text-base text-gray-300/80 max-w-3xl leading-relaxed">
        LandAir is a video creation and editing platform built for creators who
        want to move fast. Whether you&apos;re a solo creator, a brand, or a
        social media manager, LandAir gives you the tools to produce
        professional-quality videos and publish them directly to TikTok — in
        minutes, not hours.
      </p>
      <p className="text-lg md:text-base text-gray-300/80 max-w-2xl leading-relaxed">
        No complicated timelines. No switching between apps. Just create,
        refine, and post.
      </p>
    </section>
  );
};

export default About;
