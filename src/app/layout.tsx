import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/layout/navbar";
import { ClientProviders } from "@/components/providers/client-providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digital Marketplace",
  description: "Buy and sell digital products",
  keywords: ["digital", "marketplace", "products", "download"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientProviders>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 flex justify-center">{children}</main>
          </div>
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  );
}
