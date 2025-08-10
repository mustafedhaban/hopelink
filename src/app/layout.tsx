import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { NextAuthProvider } from "@/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// const inter = Inter({
//   variable: "--font-inter",
//   subsets: ["latin"],
// });

export const metadata = {
  title: {
    default: "HopeLink - Transparent NGO Project Management",
    template: "%s | HopeLink",
  },
  description:
    "Empowering NGOs with transparent project management, donation tracking, and impact measurement. Build trust through accountability.",
  keywords: [
    "NGO",
    "donations",
    "transparency",
    "project management",
    "fundraising",
    "charity",
  ],
  authors: [{ name: "HopeLink Team" }],
  creator: "HopeLink",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hopelink.org",
    title: "HopeLink - Transparent NGO Project Management",
    description:
      "Empowering NGOs with transparent project management, donation tracking, and impact measurement.",
    siteName: "HopeLink",
  },
  twitter: {
    card: "summary_large_image",
    title: "HopeLink - Transparent NGO Project Management",
    description:
      "Empowering NGOs with transparent project management, donation tracking, and impact measurement.",
  },
  robots: {
    index: true,
    follow: true,
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
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`antialiased`}>
        <NextAuthProvider>
          {children}
          <Toaster />
        </NextAuthProvider>
      </body>
    </html>
  );
}
