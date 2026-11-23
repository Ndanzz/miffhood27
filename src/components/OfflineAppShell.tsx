"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface NavMenu {
  label: string;
  href: string;
  badge?: string;
}

const APP_MENUS: NavMenu[] = [
  { label: "Kitab Tajwid", href: "/tajwid", badge: "49 Bab" },
  { label: "Makharijul Huruf", href: "/makhraj" },
  { label: "Sifatul Huruf", href: "/sifatul-huruf" },
  { label: "Utilitas Harian", href: "/utilitas" },
];

export default function OfflineAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pathname, setPathname] = useState<string>("");
  const [isOffline, setIsOffline] = useState<boolean>(false);

  useEffect(() => {
    // Sinkronkan pathname aktif di sisi klien tanpa memblokir prerender
    const syncPathname = () => {
      setPathname(window.location.pathname);
    };
    syncPathname();

    window.addEventListener("popstate", syncPathname);

    // Daftarkan Service Worker agar seluruh aset & halaman tersimpan offline
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Abaikan jika gagal di mode dev
      });
    }

    // Pantau status koneksi internet secara real-time
    setIsOffline(!navigator.onLine);
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);

    return () => {
      window.removeEventListener("popstate", syncPathname);
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* Banner Indikator Saat Offline */}
      {isOffline && (
        <div className="bg-amber-600 px-4 py-2 text-center text-xs font-bold text-white shadow-xs">
          Mode Offline Aktif â€” Seluruh materi kitab &amp; menu tetap dapat
          diakses dari penyimpanan perangkat.
        </div>
      )}

      <header className="border-b border-stone-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            onClick={() => setPathname("/")}
            className="flex items-center gap-2 font-serif text-lg font-extrabold text-emerald-800 dark:text-emerald-400"
          >
            <span>Ûž</span>
            <span>miffhood27</span>
          </Link>

          <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {APP_MENUS.map((menu) => {
              const isActive = pathname === menu.href;
              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  onClick={() => setPathname(menu.href)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition sm:text-sm ${
                    isActive
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "bg-stone-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  <span>{menu.label}</span>
                  {menu.badge && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                        isActive
                          ? "bg-emerald-900/60 text-emerald-100"
                          : "bg-stone-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {menu.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Isi Halaman */}
      <div>{children}</div>
    </div>
  );
}
