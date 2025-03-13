import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Fixed CSS file path
import { Toaster } from "sonner";
import { I18nProvider } from "@/i18n/i18n-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Markdown Card Maker",
  description: "Convert Markdown to beautiful social media cards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <I18nProvider>
          {children}
          <Toaster position="top-center" />
        </I18nProvider>
      </body>
    </html>
  );
}
