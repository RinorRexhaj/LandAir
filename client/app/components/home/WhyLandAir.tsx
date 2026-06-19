import {
  faKey,
  faLock,
  faPlug,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const trustPoints = [
  { label: "Official TikTok API", icon: faPlug },
  { label: "Secure OAuth 2.0", icon: faKey },
  { label: "Encrypted tokens", icon: faLock },
  { label: "GDPR compliant", icon: faShieldHalved },
];

const WhyLandAir = () => {
  return (
    <section
      id="why-landair"
      className="flex flex-col items-center justify-center gap-10 px-20 md:px-8 py-24 md:py-16"
    >
      <div className="text-center">
        <h2 className="text-5xl md:text-4xl font-bold mb-4">Why LandAir?</h2>
      </div>

      <blockquote className="relative max-w-3xl text-center text-2xl md:text-xl font-medium text-white/90 leading-relaxed border-l-2 md:border-l-0 border-blue-500 px-8 md:px-0 italic">
        &ldquo;We built LandAir because we were tired of the friction — editing
        in one app, exporting, uploading, captioning again in TikTok. We
        collapsed the whole workflow into one place.&rdquo;
      </blockquote>

      <p className="max-w-3xl text-center text-lg md:text-base text-gray-300/80 leading-relaxed">
        LandAir connects directly to TikTok&apos;s official Content Posting API,
        so your data is handled securely and your posts go through TikTok&apos;s
        trusted infrastructure. No third-party hacks, no workarounds.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {trustPoints.map((point) => (
          <span
            key={point.label}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm text-white/90"
          >
            <FontAwesomeIcon
              icon={point.icon}
              className="w-3.5 h-3.5 text-emerald-400"
            />
            {point.label}
          </span>
        ))}
      </div>
    </section>
  );
};

export default WhyLandAir;
