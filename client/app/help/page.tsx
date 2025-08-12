"use client";
import React from "react";
import { useThemeStore } from "../store/useThemeStore";
import Navbar from "../components/Navbar";

const sections = [
  {
    title: "1. Quick Start Guide",
    content: [
      "Create an account or log in.",
      "Enter your prompt (e.g., 'Portfolio site for a photographer with a dark theme').",
      "Review and edit your generated site.",
      "Deploy to your custom subdomain.",
    ],
  },
  {
    title: "2. Writing Effective Prompts",
    content: [
      "Be specific — mention style, colors, sections, and tone.",
      "Add details like layout, theme, and features.",
      "Avoid overly vague prompts like 'Make me a website'.",
    ],
  },
  {
    title: "3. Editing Your Generated Website",
    content: [
      "Select and edit text/images directly in the preview.",
      "Add or remove sections and elements.",
      "Change colors, fonts, and layouts.",
    ],
  },
  {
    title: "4. Deployment & Hosting",
    content: [
      "Publish your website in one click.",
      "Understand your custom subdomain (e.g., mybrand.landair.app).",
      "Update an already published site.",
    ],
  },
  {
    title: "5. Managing Projects",
    content: [
      "View all your generated sites in the dashboard.",
      "Duplicate projects easily.",
      "Delete or archive a site when no longer needed.",
    ],
  },
  {
    title: "6. Credits & Billing",
    content: [
      "1 credit = 1 new site generation.",
      "Purchase more credits from the billing page.",
      "Refund policy available in Terms & Conditions.",
    ],
  },
  {
    title: "7. Troubleshooting & FAQs",
    content: [
      "If your site looks broken, check for missing sections or assets.",
      "If generation is slow, try simplifying your prompt.",
      "If images aren’t loading, re-upload or replace them.",
      "For deployment errors, retry or contact support.",
    ],
  },
  {
    title: "8. Tips & Inspiration",
    content: [
      "Explore prompts for restaurants, portfolios, e-commerce, and more.",
      "Write SEO-friendly headings and descriptions.",
      "Design for mobile-first for best results.",
    ],
  },
  {
    title: "9. Contact & Support",
    content: [
      "Email or live chat with our support team.",
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
