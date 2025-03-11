import { TempoInit } from "@/components/tempo-init";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Insurance Sales Genie - AI-Powered Platform for Insurance Brokers",
  description:
    "An intelligent SaaS platform that empowers insurance brokers with AI-driven tools to streamline client matching, improve sales conversations, and access instant product information.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={inter.className}>
        {children}
        <TempoInit />
      </body>
    </html>
  );
}
