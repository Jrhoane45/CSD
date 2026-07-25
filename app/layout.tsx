import type { Metadata, Viewport } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-jb",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://clubsportsdirect.com"),
  title: {
    default: "Club Sports Direct — Team sports, simplified",
    template: "%s · Club Sports Direct",
  },
  description:
    "Club Sports Direct connects youth athletes to the right clubs, trainers, and advisers — vetted, data-driven matching that replaces word-of-mouth with substance.",
  keywords: [
    "youth sports",
    "club sports",
    "trainer matching",
    "athlete development",
    "CSD Score",
    "youth sports clubs",
  ],
  openGraph: {
    title: "Club Sports Direct — Team sports, simplified",
    description:
      "Find the right club, trainer, or adviser for your athlete — matched on development level, not word-of-mouth.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#14264f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${anton.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-white text-ink">{children}</body>
    </html>
  );
}
