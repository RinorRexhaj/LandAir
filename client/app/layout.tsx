import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LandAir AI",
  description:
    "LandAir is an AI-powered platform that lets anyone generate and deploy a fully responsive landing page in seconds—just by describing it in a simple prompt. Whether you're launching a product, building a portfolio, or testing an idea, LandAir turns your vision into a live website instantly—no coding, no design skills, just your words.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable}  antialiased text-white`}>
        {children}
      </body>
    </html>
  );
}
