"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/style.css";
import "@/styles/Navbar.css";
import Bootstrap from "@/lib/bootstrap";
import BusinessProfileCheck from "@/components/BusinessProfileCheck";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Bootstrap/>
        <BusinessProfileCheck>
          {children}
        </BusinessProfileCheck>
      </body>
    </html>
  );
}
