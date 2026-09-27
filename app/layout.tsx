import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PresentationModeProvider } from "@/lib/presentation-context";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "AARAN AI — Junior VC Copilot",
  description: "AI venture intelligence for the next generation. Built by Aaran Chowdhery.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${mono.variable} font-sans`}>
        <PresentationModeProvider>
          <AppShell>{children}</AppShell>
        </PresentationModeProvider>
      </body>
    </html>
  );
}
