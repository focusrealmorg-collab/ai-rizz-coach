import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RizzCoach AI — Your AI Dating Wingman",
  description: "Stop getting left on read. Get the ultimate AI Wingman that crafts killer responses, optimizes your profile, and coaches you to date smarter.",
  keywords: ["dating coach", "AI dating", "rizz", "dating tips", "conversation coach"],
  openGraph: {
    title: "RizzCoach AI — Your AI Dating Wingman",
    description: "Stop getting left on read. Get the ultimate AI Wingman.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
