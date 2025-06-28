import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dm = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LandAir",
  description:
    "LandAir is an AI-powered platform that lets anyone generate and deploy a fully responsive landing page in seconds—just by describing it in a simple prompt. Whether you're launching a product, building a portfolio, or testing an idea, LandAir turns your vision into a live website instantly. No coding, no design skills, just your words.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dm.variable} antialiased text-white`}>
        {children}
      </body>
    </html>
  );
}
