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
    "Comprehensive drug interaction analysis powered by DrugBank. Check drug-drug, drug-target, drug-food, and drug-condition interactions.",
  keywords: [
    "drug interaction",
    "DDI",
    "DTI",
    "DrugBank",
    "drug-food interaction",
    "drug conditions",
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
