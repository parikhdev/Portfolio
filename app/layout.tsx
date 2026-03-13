import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, Space_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yash Parikh — Full Stack AI Developer",
  description:
    "Editorial portfolio of Yash Parikh — Full Stack AI Developer, BTech CSE (AI & ML), Builder, and Content Creator.",
  openGraph: {
    title: "Yash Parikh — Full Stack AI Developer",
    description: "Building AI-powered systems. Based in India.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSerif.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}