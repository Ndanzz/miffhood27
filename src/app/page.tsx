'use client';

import React, { useState } from 'react';
import { Sparkles, MapPin, Clock, BookOpen, Compass, Bookmark, Moon } from 'lucide-react';

export default function Home() {
  const [currentPrayer] = useState({ name: 'Dzuhur', time: '12:04' });
  const [countdown] = useState('02:15:40');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-24 transition-colors duration-300">
      {/* Header / Hero Section */}
      <header className="bg-emerald-600 dark:bg-emerald-900 text-white px-4 pt-6 pb-12 rounded-b-3xl shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center mb-6">
          <div>
            <span className="text-xs uppercase tracking-wider bg-emerald-700 dark:bg-emerald-800 px-3 py-1 rounded-full font-medium">
              miffhood27 PWA
            </span>
            <h1 className="text-2xl font-bold mt-2">Ahlan wa Sahlan, Sahabat ✨</h1>
          </div>
          <div className="flex items-center gap-2 bg-emerald-700/50 dark:bg-emerald-800/50 px-3 py-2 rounded-2xl backdrop-blur-sm">
            <MapPin className="w-4 h-4 text-emerald-200" />
            <span className="text-sm font-medium">Jakarta, ID</span>
          </div>
        </div>

        {/* Widget Jadwal Sholat Terdekat */}
        <div className="max-w-4xl mx-auto bg-white/10 dark:bg-slate-900/40 border border-white/20 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Clock className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <p className="text-xs text-emerald-100">Menuju Sholat {currentPrayer.name}</p>
              <p className="text-lg font-bold">{currentPrayer.time} WIB</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-emerald-200 block">Sisa Waktu</span>
            <span className="text-sm font-mono font-semibold bg-emerald-800/40 px-2.5 py-1 rounded-lg">
              {countdown}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-4 -mt-6 space-y-6">
        {/* Quick Access Menu / Modul Islami Utama */}
        <section className="grid grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <a href="/islamic/quran" className="flex flex-col items-center gap-1.5 group">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-105 transition">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-center">Al-Qur'an</span>
          </a>
          <a href="/islamic/doa" className="flex flex-col items-center gap-1.5 group">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl group-hover:scale-105 transition">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-center">Do'a Harian</span>
          </a>
          <a href="/islamic/sholat" className="flex flex-col items-center gap-1.5 group">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-105 transition">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-center">Panduan Sholat</span>
          </a>
          <a href="/islamic/kiblat" className="flex flex-col items-center gap-1.5 group">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-105 transition">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-center">Kiblat</span>
          </a>
        </section>

        {/* Card Pengingat / Mutaba'ah Harian */}
        <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Moon className="w-5 h-5" />
            <h3 className="font-bold text-base">Amalan Harian</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            "Barangsiapa membaca satu huruf dari Kitab Allah, maka baginya satu kebaikan dengan membaca huruf tersebut, dan satu kebaikan dilipatgandakan menjadi sepuluh kebaikan." (HR. Tirmidzi)
          </p>
        </section>

        {/* Section Bookmark / Akses Cepat Doa Simpanan */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Bookmark Saya
            </h3>
            <a href="/islamic/quran" className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
              Buka Al-Qur'an
            </a>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 text-center space-y-2 shadow-sm">
            <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada ayat atau doa yang disimpan.</p>
            <p className="text-xs text-slate-400">Tandai ayat favorit Anda saat membaca Al-Qur'an untuk membacanya kembali di sini.</p>
          </div>
        </section>
      </main>
    </div>
  );
}