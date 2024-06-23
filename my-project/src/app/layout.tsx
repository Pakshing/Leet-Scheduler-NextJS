import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "../../components/layouts/Navbar";
import Footer from "../../components/layouts/Footer";

import "./globals.css";
import SessionWrapper from "../../components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LeetCode Scheduler",
  description: "Personal LeetCode database and scheduler",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
        <html lang="en">
          <body className={inter.className}>
            <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow">{children}</div>
            <Footer />
            </div>
          </body>
        </html>
    </SessionWrapper>
  );
}
