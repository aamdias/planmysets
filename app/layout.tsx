import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react"
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Maromba AI",
  description: "AI Generated Gym Exercises",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ height: '100%' }}>
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Header />
        {children}
        <Footer />
        <Analytics />
        </div>
      </body>
    </html>
  );
}
