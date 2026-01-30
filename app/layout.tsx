import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import Sidebar from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MindPulse",
  description: "AI-Powered Well-being Assessment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-slate-50 text-slate-900 pb-20 lg:pb-0`}>
        <div className="min-h-screen bg-slate-50 flex">
          {/* Desktop Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 lg:ml-64 w-full max-w-7xl mx-auto min-h-screen bg-white shadow-none lg:shadow-xl lg:my-4 lg:rounded-2xl lg:overflow-hidden relative">
            <div className="h-full overflow-y-auto">
              {children}
            </div>
            <BottomNav />
          </main>
        </div>
      </body>
    </html>
  );
}
