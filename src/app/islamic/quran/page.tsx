'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Search, ArrowLeft } from 'lucide-react';

interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
}

export default function QuranPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSurahs() {
      try {
        const res = await fetch('https://equran.id/api/v2/surat');
        const data = await res.json();
        setSurahs(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSurahs();
  }, []);

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.namaLatin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.arti.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.nomor.toString() === searchQuery.trim()
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-24">
      <header className="sticky top-0 z-10 bg-emerald-600 dark:bg-emerald-900 text-white px-4 py-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-xl bg-emerald-700/50 hover:bg-emerald-700 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> Al-Qur'an Digital
            </h1>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-4 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari surah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-6">
        {loading ? (
          <div className="py-16 text-center text-sm text-slate-500">Memuat Al-Qur'an...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredSurahs.map((surah) => (
              <Link
                key={surah.nomor}
                href={`/islamic/quran/${surah.nomor}`}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:border-emerald-500 transition shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm">
                    {surah.nomor}
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{surah.namaLatin}</h3>
                    <p className="text-xs text-slate-500">{surah.arti} • {surah.jumlahAyat} Ayat</p>
                  </div>
                </div>
                <span className="text-xl font-serif text-emerald-700 dark:text-emerald-300">{surah.nama}</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}