import type { Metadata } from "next";
import { Quicksand, Inter } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RiseUpZone — Premium Plush Toys & Teddy Bears",
  description:
    "Shop More. Save More. Rise Together. Discover our collection of premium, huggable teddy bears and character plush toys. Perfect gifts for every occasion. Fast delivery & secure payments.",
  keywords: [
    "teddy bear",
    "plush toys",
    "soft toys",
    "gift",
    "RiseUpZone",
    "premium teddy",
    "pikachu plush",
  ],
  openGraph: {
    title: "RiseUpZone — Premium Plush Toys & Teddy Bears",
    description:
      "Discover our collection of premium, huggable teddy bears and character plush toys.",
    type: "website",
  },
};

import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${quicksand.variable} ${inter.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
