import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Voice PDF Agent",
  description: "Automate PDF filling via Voice",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevent zooming for app-like feel
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full antialiased bg-background text-foreground`}>
        <div className="mx-auto flex h-full max-w-md flex-col overflow-hidden relative">
          <main className="flex-1 overflow-y-auto pb-20">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
