"use client";
import React from "react";
import { useThemeStore } from "../store/useThemeStore";
import Navbar from "../components/Navbar";

const sections = [
  {
    title: "1. Quick Start Guide",
    content: [
      "Create an account or log in.",
      "Upload your footage or start from a TikTok-ready template.",
      "Edit your video — trim clips, add captions, music, and effects.",
      "Connect your TikTok account and post directly from LandAir.",
    ],
  },
  {
    title: "2. Connecting Your TikTok Account",
    content: [
      "Go to Settings and select 'Connect TikTok'.",
      "Authorize LandAir through TikTok's official OAuth login.",
      "We never see or store your TikTok password.",
      "You can disconnect at any time from your account settings.",
    ],
  },
  {
    title: "3. Editing Your Video",
    content: [
      "Trim, cut, merge, and layer clips in the editor.",
      "Add text overlays, transitions, and effects.",
      "Sync music, adjust audio levels, and record voiceovers.",
    ],
  },
  {
    title: "4. Posting to TikTok",
    content: [
      "Preview your video exactly as it will appear on TikTok.",
      "Add your caption, hashtags, and privacy settings.",
      "Publish instantly or schedule for later via the official Content Posting API.",
    ],
  },
  {
    title: "5. Managing Your Posts",
    content: [
      "View all your videos and drafts in the dashboard.",
      "Track what has been published to TikTok.",
      "Reschedule, duplicate, or delete posts when needed.",
    ],
  },
  {
    title: "6. Plans & Billing",
    content: [
      "Start free, upgrade to a paid plan for more features.",
      "Manage your subscription from the billing page.",
      "Refund policy available in our Terms of Service.",
    ],
  },
  {
    title: "7. Troubleshooting & FAQs",
    content: [
      "If a post fails, confirm your TikTok account is still connected.",
      "Re-authorize TikTok if your session has expired.",
      "Check that your video meets TikTok's format and length requirements.",
      "For posting errors, retry or contact support.",
    ],
  },
  {
    title: "8. Tips & Inspiration",
    content: [
      "Design for TikTok's vertical 9:16 format for best results.",
      "Hook viewers in the first three seconds.",
      "Save your own templates for consistent branding.",
    ],
  },
  {
    title: "9. Contact & Support",
    content: [
      "Email our support team at rinorrexhaj10@gmail.com.",
      "Support available Mon–Fri, 9am–6pm.",
    ],
  },
];

const Help = () => {
  const { darkMode } = useThemeStore();
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Navbar />
      <h1 className="text-2xl font-bold mb-8 mt-12 animate-slideIn [animation-fill-mode:backwards]">
        Help & Documentation
      </h1>
      <div className="space-y-8 animate-fade [animation-fill-mode:backwards]">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className={`${
              darkMode ? "bg-zinc-800 text-white" : "bg-zinc-300 text-zinc-900"
            } p-6 rounded-xl shadow-md`}
          >
            <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
            <ul
              className={`list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300`}
            >
              {section.content.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Help;
