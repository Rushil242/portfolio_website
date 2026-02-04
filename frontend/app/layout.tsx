// frontend/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Ensure this import exists
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Automation Solutions",
  description: "Automate your business workflows with intelligent agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* We add 'antialiased' to make text look sharp like Apple's site */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}