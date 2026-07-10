import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Toaster from "@/components/Toaster";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Cookbook",
  description: "Your personal recipe collection and cooking companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen flex flex-col bg-background text-text">
        {/* Top header (all sizes) + mobile bottom bar */}
        <Navigation />

        {/* Main Content */}
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>

        <Toaster />
      </body>
    </html>
  );
}
