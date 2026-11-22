'use client';

import React from 'react';
import Link from 'next/link';
import {
  Mic,
  ArrowLeft,
  BookOpenCheck,
  Languages,
  ChevronRight,
  AudioWaveform,
} from 'lucide-react';

export default function TahsinMenuPage() {
  const tahsinSections = [
    {
      title: 'Makhorijul Huruf',
      subtitle: '17 Tempat Keluarnya Huruf Hijaiyah',
      description:
        'Pelajari 17 pembagian makhraj mulai dari Al-Jauf, Al-Halq (tenggorokan), Al-Lisan (lidah), Asy-Syafatain (bibir), hingga Al-Khaisyum.',
      href: '/islamic/tahsin/makhorijul-huruf',
      icon: Languages,
      badge: '17 Makhroj',
      colorBg: 'bg-sky-50 dark:bg-sky-950/60',
      colorText: 'text-sky-600 dark:text-sky-400',
      borderHover: 'hover:border-sky-500',
    },
    {
      title: 'Sifatul Huruf',
      subtitle: 'Karakteristik & Sifat-Sifat Huruf',
      description:
        'Pelajari sifat huruf yang memiliki lawan (Hams, Jahr, Syiddah, Isti\'la, Ithbaq) serta sifat tunggal (Qalqalah, Shafir, Lin, Tafasysyi).',
      href: '/islamic/tahsin/sifatul-huruf',
      icon: AudioWaveform,
      badge: 'Sifat & Karakter',
      colorBg: 'bg-emerald-50 dark:bg-emerald-950/60',
      colorText: 'text-emerald-600 dark:text-emerald-400',
      borderHover: 'hover:border-emerald-500',
    },
    {
      title: "Tajwid Al-Qur'an",
      subtitle: 'Hukum Bacaan & Panjang Pendek',
      description:
        'Pelajari hukum Nun Sukun & Tanwin, hukum Mim Sukun, Qalqalah, Ghunnah, serta hukum bacaan Mad lengkap dengan contoh ayat.',
      href: '/islamic/tahsin/tajwid',
      icon: BookOpenCheck,
      badge: 'Hukum Bacaan',
      colorBg: 'bg-indigo-50 dark:bg-indigo-950/60',
      colorText: 'text-indigo-600 dark:text-indigo-400',
      borderHover: 'hover:border-indigo-500',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-24 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-sky-600 dark:bg-sky-900 text-white px-4 py-4 shadow-md backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-sky-700/50 hover:bg-sky-700 transition"
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Mic className="w-5 h-5 text-sky-200" />
              Tahsin Al-Qur&apos;an
            </h1>
            <p className="text-xs text-sky-100">
              Pilih materi makhraj, sifat huruf, atau ilmu tajwid
            </p>
          </div>
        </div>
      </header>

      {/* Pilihan Sub-Menu Tahsin */}
      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-4">
        {tahsinSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className={`block bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm transition group ${section.borderHover}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3.5 rounded-2xl shrink-0 ${section.colorBg} ${section.colorText}`}
                  >
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {section.badge}
                    </span>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      {section.title}
                    </h2>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {section.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                      {section.description}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition shrink-0 mt-2" />
              </div>
            </Link>
          );
        })}
      </main>
    </div>
  );
}