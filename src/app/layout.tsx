import type { Metadata, Viewport } from "next";
import { Amiri, Noto_Naskh_Arabic, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import OfflineAppShell from "@/components/OfflineAppShell";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "miffhood27 — Kitab Tajwid, Tahsin & Utilitas Harian",
  description:
    "Aplikasi PWA & Kitab Ilmu Tajwid Pegon Sunda, Makharijul Huruf, Sifatul Huruf, dan Utilitas Harian offline-ready.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "miffhood27",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192x192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#047857",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${notoNaskhArabic.variable} ${amiri.variable}`}
    >
      <body className="overflow-x-hidden bg-stone-50 font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-white">
        <OfflineAppShell>{children}</OfflineAppShell>
      </body>
    </html>
  );
}