'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Search, ArrowLeft, Bookmark, Volume2, Sparkles } from 'lucide-react';

interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
}

export default function QuranPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSurahs() {
      try {
        setLoading(true);
        const res = await fetch('https://equran.id/api/v2/surat');
        if (!res.ok) throw new Error('Gagal mengambil data Al-Qur\'an');
        const data = await res.json();
        setSurahs(data.data);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat memuat data.');
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-24 transition-colors duration-300">
      {/* Top Bar / Header */}
      <header className="sticky top-0 z-10 bg-emerald-600 dark:bg-emerald-900 text-white px-4 py-4 shadow-md backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="p-2 rounded-xl bg-emerald-700/50 hover:bg-emerald-700 transition dark:bg-emerald-800/50"
              aria-label="Kembali ke Beranda"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-200" />
                Al-Qur'an Digital
              </h1>
              <p className="text-xs text-emerald-100">114 Surah Lengkap dengan Terjemahan</p>
            </div>
          </div>
        </div>

        {/* Input Search Surah */}
        <div className="max-w-4xl mx-auto mt-4 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari surah (misal: Al-Fatihah, Yasin, 36)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm shadow-inner"
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-4">
        {loading && (
          <div className="py-16 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Memuat Surah Al-Qur'an...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 p-4 rounded-2xl text-center text-sm">
            {error}
          </div>
        )}

        {!loading && !error && filteredSurahs.length === 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 text-center space-y-2">
            <p className="text-base font-semibold">Surah tidak ditemukan</p>
            <p className="text-xs text-slate-400">Coba kata kunci pencarian yang lain.</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredSurahs.map((surah) => (
              <a
                key={surah.nomor}
                href={`/islamic/quran/${surah.nomor}`}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-4 transition shadow-sm hover:shadow-md flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  {/* Badge Nomor Surah */}
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm border border-emerald-100 dark:border-emerald-900/40 group-hover:bg-emerald-600 group-hover:text-white transition">
                    {surah.nomor}
                  </div>

                  {/* Info Nama Surah */}
                  <div>
                    <h3 className="font-bold text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                      {surah.namaLatin}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      {surah.arti} • {surah.jumlahAyat} Ayat
                    </p>
                  </div>
                </div>

                {/* Nama Tulisan Arab Surah */}
                <div className="text-right">
                  <span className="text-xl font-serif text-emerald-700 dark:text-emerald-300 block">
                    {surah.nama}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">
                    {surah.tempatTurun}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}