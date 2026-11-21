'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  Compass,
  UtensilsCrossed,
  Clock,
  ChevronRight,
  MoonStar,
} from 'lucide-react';

export default function HomePage() {
  const [logoError, setLogoError] = useState(false);

  const islamicMenus = [
    {
      title: "Al-Qur'an Digital",
      description: 'Baca 114 surah lengkap dengan audio & terjemahan',
      href: '/islamic/quran',
      icon: BookOpen,
      colorBg: 'bg-emerald-50 dark:bg-emerald-950/60',
      colorText: 'text-emerald-600 dark:text-emerald-400',
      borderHover: 'hover:border-emerald-500',
    },
    {
      title: "Kumpulan Do'a",
      description: 'Doa harian pilihan lengkap dengan tulisan Arab & Latin',
      href: '/islamic/doa',
      icon: Sparkles,
      colorBg: 'bg-amber-50 dark:bg-amber-950/60',
      colorText: 'text-amber-600 dark:text-amber-400',
      borderHover: 'hover:border-amber-500',
    },
    {
      title: 'Arah Kiblat & Sholat',
      description: "Kompas penunjuk Ka'bah & jadwal sholat otomatis",
      href: '/islamic/kiblat',
      icon: Compass,
      colorBg: 'bg-teal-50 dark:bg-teal-950/60',
      colorText: 'text-teal-600 dark:text-teal-400',
      borderHover: 'hover:border-teal-500',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-24 transition-colors duration-300">
      {/* Header Utama dengan Logo */}
      <header className="bg-gradient-to-br from-emerald-600 via-teal-600 to-teal-700 dark:from-emerald-900 dark:via-teal-900 dark:to-slate-900 text-white px-5 pt-8 pb-11 rounded-b-3xl shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full">
              <MoonStar className="w-3.5 h-3.5 text-amber-200" />
              miffhood27 App
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight pt-1">
              Assalamu&apos;alaikum
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-md">
              Pendamping ibadah harian dan layanan kuliner dalam satu aplikasi praktis.
            </p>
          </div>

          {/* Container Logo Aplikasi */}
          <div className="shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/95 dark:bg-slate-900/90 p-1.5 shadow-lg border-2 border-white/30 flex items-center justify-center overflow-hidden">
              {!logoError ? (
                <img
                  src="/logo.png"
                  alt="Logo miffhood27"
                  onError={() => setLogoError(true)}
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-emerald-600 flex flex-col items-center justify-center text-white">
                  <MoonStar className="w-7 h-7 text-amber-300" />
                  <span className="text-[9px] font-extrabold tracking-wider mt-0.5">
                    MH27
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="max-w-4xl mx-auto px-4 -mt-5 space-y-7">
        {/* Banner Cepat Arah Kiblat & Jadwal Sholat */}
        <Link
          href="/islamic/kiblat"
          className="block bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:border-teal-500 transition group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Cek Jadwal Sholat &amp; Arah Kiblat
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Akurat sesuai koordinat lokasi GPS Anda sekarang
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition" />
          </div>
        </Link>

        {/* Bagian Modul Ibadah & Islami */}
        <section className="space-y-3">
          <div className="px-1">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Fitur Islami
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Akses Al-Qur&apos;an, doa harian, dan penunjuk arah Kiblat
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {islamicMenus.map((menu) => {
              const IconComponent = menu.icon;
              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex sm:flex-col items-center sm:items-start gap-3.5 shadow-sm transition ${menu.borderHover}`}
                >
                  <div className={`p-3 rounded-xl shrink-0 ${menu.colorBg} ${menu.colorText}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                      {menu.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {menu.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Bagian Modul Kuliner / Menu */}
        <section className="space-y-3">
          <div className="px-1">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Layanan Kuliner
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pesan menu makanan dan minuman favorit
            </p>
          </div>

          <Link
            href="/menu"
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between hover:border-orange-500 transition shadow-sm group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  Katalog Menu &amp; Pemesanan
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Lihat daftar menu tersedia dan buat pesanan
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition" />
          </Link>
        </section>
      </main>
    </div>
  );
}