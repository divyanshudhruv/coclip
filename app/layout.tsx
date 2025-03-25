import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({ 
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoClip - Your Cloud Clipboard, Accessible Anywhere!",
  description:
    "CoClip is a universal clipboard that lets you copy text from one device and access it on another effortlessly. Whether it's quick notes, code snippets, or important links, CoClip keeps your clipboard safe, synced, and always available.",
  keywords: [
    "CoClip",
    "Cloud Clipboard",
    "Cross-device clipboard",
    "Online clipboard",
    "Clipboard sync",
    "Universal clipboard",
    "Copy paste anywhere",
    "Save text online",
    "Paste",
    "CopyPaste",
  ],
  applicationName: "CoClip",
  authors: [{ name: "Divyanshu Dhruv" }],
  creator: "Divyanshu Dhruv",
  publisher: "CoClip",
  icons: "/favicon.ico",
  themeColor: "#0f172a",
  metadataBase: new URL("https://coclip.vercel.app"),
  openGraph: {
    title: "CoClip - Your Cloud Clipboard, Accessible Anywhere!",
    description:
      "CoClip is a universal clipboard that syncs text across devices instantly. Copy once, access anywhere.",
    url: "https://coclip.vercel.app",
    siteName: "CoClip",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "CoClip - Your Cloud Clipboard, Accessible Anywhere!",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CoClip - Your Cloud Clipboard, Accessible Anywhere!",
    description:
      "CoClip lets you copy text from one device and access it on another effortlessly.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="robots" content="index, follow" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <Analytics/>
        {children}
      </body>
    </html>
  );
}
