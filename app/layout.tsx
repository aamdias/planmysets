import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react"
import Header from "@/components/Header";
import {
  ClerkProvider
} from '@clerk/nextjs'

const inter = Inter({ subsets: ["latin"] });
const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Maromba AI',
  description: 'AI Generated Gym Exercises',
  openGraph:{
    title: 'MarombaAI',
    description: 'The app to help musicians choose what to play next',
    images: [
      {
        url: `${domain}/og-image-maromba-ai.png`,
        width: 305,
        height: 162,
        alt: 'MarombaAI',
      },
    ]
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className} style={{ height: '100%' }}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Analytics />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
