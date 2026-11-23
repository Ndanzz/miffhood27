"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface NavMenu {
  label: string;
  shortLabel: string;
  href: string;
  badge?: string;
}

const APP_MENUS: NavMenu[] = [
  { label: "Kitab Tajwid", shortLabel: "Tajwid", href: "/tajwid", badge: "49" },
  { label: "Makharijul Huruf", shortLabel: "Makhraj", href: "/makhraj" },
  { label: "Sifatul Huruf", shortLabel: "Sifat", href: "/sifatul-huruf" },
  { label: "Utilitas Harian", shortLabel: "Utilitas", href: "/utilitas" },
];

export default function OfflineAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pathname, setPathname] = useState<string>("");
  const [isOffline, setIsOffline] = useState<boolean>(false);

  useEffect(() => {
    const syncPathname = () => {
      setPathname(window.location.pathname);
    };
    syncPathname();

    window.addEventListener("popstate", syncPathname);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Abaikan jika gagal di mode dev
      });
    }

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
    <div className="min-h-screen overflow-x-hidden bg-stone-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* Banner Indikator Saat Offline */}
      {isOffline && (
        <div className="sticky top-0 z-40 bg-amber-600 px-3 py-2 text-center text-xs font-bold text-white shadow-xs">
          Mode Offline Aktif — Seluruh materi kitab &amp; menu tetap bisa
          dibuka.
        </div>
      )}

      {/* Header Atas (Ringkas di HP, Lengkap di Desktop) */}
      <header className="sticky top-0 z-30 border-b border-stone-200/90 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/"
            onClick={() => setPathname("/")}
            className="flex min-h-[40px] items-center gap-2 font-serif text-lg font-extrabold tracking-tight text-emerald-800 dark:text-emerald-400"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-xs font-bold text-white">
              M
            </span>
            <span>miffhood27</span>
          </Link>

          {/* Navigasi Desktop / Tablet */}
          <nav className="hidden items-center gap-1.5 md:flex">
            {APP_MENUS.map((menu) => {
              const isActive = pathname === menu.href;
              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  onClick={() => setPathname(menu.href)}
                  className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
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

          {/* Indikator Status Koneksi Ringkas di HP */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold md:hidden ${
              isOffline
                ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isOffline ? "bg-amber-500" : "bg-emerald-500"
              }`}
            />
            {isOffline ? "Offline" : "Siap"}
          </span>
        </div>
      </header>

      {/* Konten Utama — diberi padding bawah ekstra di HP agar tidak tertutup Bottom Nav */}
      <main className="mx-auto max-w-4xl px-3.5 pt-4 pb-24 sm:px-5 md:pb-10">
        {children}
      </main>

      {/* Bottom Navigation Bar Khusus Layar HP */}
      <nav
        aria-label="Navigasi Utama HP"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 md:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1 px-2 py-1.5">
          {APP_MENUS.map((menu) => {
            const isActive = pathname === menu.href;
            return (
              <Link
                key={menu.href}
                href={menu.href}
                onClick={() => setPathname(menu.href)}
                className={`flex min-h-[48px] flex-col items-center justify-center rounded-xl px-1 py-1 text-center transition active:scale-[0.98] ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "text-slate-600 hover:bg-stone-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <span className="text-xs font-bold leading-tight">
                  {menu.shortLabel}
                </span>
                {menu.badge && (
                  <span
                    className={`mt-0.5 text-[10px] font-semibold leading-none ${
                      isActive ? "text-emerald-100" : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {menu.badge} Bab
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}