import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Drug Interaction Checker",
    template: "%s | Drug Interaction Checker",
  },
  description:
    "AI-powered drug interaction analysis. Check drug-drug, drug-target, and protein-protein interactions with data from Therapeutics Data Commons.",
  keywords: [
    "drug interaction",
    "DDI",
    "DTI",
    "PPI",
    "gene-disease association",
    "drug response",
    "TDC",
    "pharmacology",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
