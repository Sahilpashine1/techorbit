import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import AppShell from "@/components/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TechOrbit - AI-Powered Tech Career Intelligence Platform",
  description: "Discover global tech jobs, real-time tech news, AI career guidance, smart networking, and personality insights. Your launchpad for a better tech career.",
  keywords: "tech jobs, AI career guidance, tech news, networking, resume analysis, skill demand",
  openGraph: {
    title: "TechOrbit - AI-Powered Tech Career Intelligence",
    description: "Your AI-powered gateway to the global tech career landscape.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={inter.variable} style={{ fontFamily: "var(--font-inter, var(--font-sans))" }}>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
