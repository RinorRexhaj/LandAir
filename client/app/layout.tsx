import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

// const dm = DM_Sans({
//   variable: "--font-dm-sans",
//   subsets: ["latin"],
// });
const dm = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LandAir – Create, Edit & Post Videos to TikTok",
  description:
    "LandAir is a video creation and editing platform that lets creators produce polished, TikTok-ready videos and publish them directly to TikTok using the official Content Posting API — all in one place. Create, refine, and post without ever leaving the app.",
  keywords: [
    "TikTok video editor",
    "post to TikTok",
    "TikTok Content Posting API",
    "video creation platform",
    "TikTok scheduler",
    "social media video editor",
    "LandAir",
    "edit and post TikTok videos",
  ],
  metadataBase: new URL("https://landair.app"),
  openGraph: {
    title: "LandAir – Create, Edit & Post Videos to TikTok",
    description:
      "Turn your ideas into polished, TikTok-ready videos and post them directly to TikTok via the official Content Posting API. Create, refine, and post — all in one place.",
    url: "https://landair.app",
    siteName: "LandAir",
    images: [
      {
        url: "/og/og-image.png", // Recommended 1200x630
        width: 1200,
        height: 630,
        alt: "LandAir – Create, Edit & Post Videos to TikTok",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LandAir – Create, Edit & Post Videos to TikTok",
    description:
      "Turn your ideas into polished, TikTok-ready videos and post them directly to TikTok via the official Content Posting API. Create, refine, and post — all in one place.",
    images: ["/og/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Web App Manifest */}
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/icons/favicon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/icons/favicon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/icons/favicon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/icons/favicon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/icons/favicon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/icons/favicon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/icons/favicon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/favicon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/favicon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/icons/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icons/favicon-192x192.png"
        />
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="/icons/favicon.ico"
        />
        <link rel="icon" type="image/x-icon" href="/icons/favicon.ico" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/favicon-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />

        {/* Robots */}
        <meta name="robots" content="index, follow" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://landair.app" />

        {/* Viewport (just in case it's not included elsewhere) */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${dm.variable} antialiased text-white font-sans minimal-scrollbar`}
        style={{
          background: "#171717",
        }}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
