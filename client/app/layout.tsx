import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const dm = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LandAir",
  description:
    "LandAir is an AI-powered platform that lets anyone generate and deploy a fully responsive landing page in seconds, just by describing it in a simple prompt. Whether you're launching a product, building a portfolio, or testing an idea, LandAir turns your vision into a live website instantly. No coding, no design skills, just your words.",
  keywords: [
    "AI landing page generator",
    "landing page builder",
    "instant website creation",
    "no code landing pages",
    "AI website generator",
    "LandAir",
    "generate landing pages with AI",
  ],
  metadataBase: new URL("https://landair.app"),
  openGraph: {
    title: "LandAir – Instantly Generate AI-Powered Landing Pages",
    description:
      "Create and deploy responsive landing pages in seconds using AI. Just describe your idea. No coding, no design—just results.",
    url: "https://landair.app",
    siteName: "LandAir",
    images: [
      {
        url: "/og/og-image.png", // Recommended 1200x630
        width: 1200,
        height: 630,
        alt: "LandAir – AI Landing Page Generator",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LandAir – Instantly Generate AI-Powered Landing Pages",
    description:
      "Create and deploy responsive landing pages in seconds using AI. Just describe your idea. No coding, no design—just results.",
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
      <body className={`${dm.variable} antialiased text-white`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
