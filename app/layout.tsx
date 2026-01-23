import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from 'sonner';

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ChatBot from '@/components/ChatBot'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'GC WAB INVESTMENTS - Luxury Automotive & Fashion',
  description: 'Premium automotive and fashion brands under GC WAB INVESTMENTS portfolio',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <Nav />

        {children}

        <Footer />

        <ChatBot />

        <Toaster position="top-center" richColors />

      </body>
    </html>
  );
}
