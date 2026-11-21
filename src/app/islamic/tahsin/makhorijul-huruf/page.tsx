'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Languages,
  ArrowLeft,
  Search,
  BookCheck,
  Layers,
  ScrollText,
  Info,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface MakhrajMaterial {
  id: string;
  nomor?: number | null;
  category: string;
  sub_category?: string | null;
  title: string;
  letters: string;
  explanation: string;
  example_arabic: string;
  example_latin: string;
  how_to_read: string;
}

export default function MakhorijulHurufPage() {
  const [materials, setMaterials] = useState<MakhrajMaterial[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('Semua (17 Makhroj)');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchMakhraj() {
      try {
        setLoading(true);
        setErrorMsg(null);

        const { data, error } = await supabase
          .from('mh_tahsin')
          .select('*')
          .eq('category', 'Makharijul Huruf')
          .order('nomor', { ascending: true });

        if (error) {
          setErrorMsg(error.message);
        } else if (data) {
          setMaterials(data);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMsg(err.message);
        } else {
          setErrorMsg('Gagal memuat data Makhorijul Huruf dari Supabase.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMakhraj();
  }, []);

  const subCategoriesList = Array.from(
    new Set(
      materials
        .filter((item) => item.sub_category && item.sub_category.trim() !== '')
        .map((item) => item.sub_category as string)
    )
  );

  const subCategories =
    subCategoriesList.length > 0 ? ['Semua (17 Makhroj)', ...subCategoriesList] : [];

  const filteredMaterials = materials.filter((item) => {
    const matchesSubCategory =
      subCategories.length === 0 ||
      selectedSubCategory === 'Semua (17 Makhroj)' ||
      item.sub_category === selectedSubCategory;

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.letters.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.sub_category &&
        item.sub_category.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSubCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-24 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-sky-600 dark:bg-sky-900 text-white px-4 py-4 shadow-md backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link
            href="/islamic/tahsin"
            className="p-2 rounded-xl bg-sky-700/50 hover:bg-sky-700 transition"
            aria-label="Kembali ke Menu Tahsin"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Languages className="w-5 h-5 text-sky-200" />
              Makhorijul Huruf (17 Makhroj)
            </h1>
            <p className="text-xs text-sky-100">
              Terstruktur berdasarkan Nadhom Muqaddimah Jazariyah
            </p>
          </div>
        </div>

        {/* Input Pencarian */}
        <div className="max-w-4xl mx-auto mt-4 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nomor makhraj, nama bagian, atau huruf..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-inner"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-5 space-y-5">
        {/* Kartu Muqaddimah / Pengantar Pembagian 17 Makhroj */}
        <section className="bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-900/70 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-bold text-sm">
            <Info className="w-4 h-4 shrink-0" />
            <span>Kaidah Umum: Makhorijul Huruf Sadayana Aya 17</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="font-bold text-slate-800 dark:text-slate-100">
                1. Makhroj Muhaqqoq (15 Makhroj)
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Hartosna anu tangtu tempat kaluarna, nyaeta ti mimiti{' '}
                <strong>No. ka-2 nepi ka No. 16</strong> (Al-Halq, Al-Lisan, &amp; Asy-Syafatain).
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="font-bold text-slate-800 dark:text-slate-100">
                2. Makhroj Muqoddar (2 Makhroj)
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Hartosna dikira-kirakeun tempat kaluarna, nyaeta{' '}
                <strong>No. 1 (Al-Jauf)</strong> jeung{' '}
                <strong>No. 17 (Al-Khaisyum)</strong>.
              </p>
            </div>
          </div>

          <div className="bg-sky-50/70 dark:bg-sky-950/40 rounded-xl p-3 border border-sky-100 dark:border-sky-900/50 text-center space-y-1">
            <p className="text-lg sm:text-xl font-serif text-sky-900 dark:text-sky-200 leading-relaxed">
              مَخَارِجُ الْحُرُوْفِ سَبْعَةَ عَشَرْ ۞ عَلَى الَّذِيْ يَخْتَارُهُ مَنِ اخْتَبَرْ
            </p>
            <p className="text-[11px] italic text-sky-700 dark:text-sky-400">
              &quot;Makhroj huruf sadayana 17 — Kitu saur ulama nu langkung jelas&quot;
            </p>
          </div>
        </section>

        {/* Filter 5 Kelompok Utama Makhraj */}
        {subCategories.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 shadow-sm space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 px-1">
              <Layers className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Filter Kelompok Utama Makhraj:</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {subCategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubCategory(sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                    selectedSubCategory === sub
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Daftar 17 Makhraj */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Memuat 17 Makhorijul Huruf...
            </p>
          </div>
        ) : errorMsg ? (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center space-y-2">
            <p className="text-sm font-bold text-red-600 dark:text-red-400">
              Gagal Memuat Data
            </p>
            <p className="text-xs text-red-500 font-mono break-all">{errorMsg}</p>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 text-center space-y-2">
            <p className="text-base font-semibold">Materi tidak ditemukan</p>
            <p className="text-xs text-slate-400">
              Belum ada data pada bagian ini atau kata kunci tidak cocok.
            </p>
          </div>
        ) : (
          filteredMaterials.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3.5 hover:border-sky-400 transition"
            >
              {/* Header Lencana Kelompok & Huruf */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {item.sub_category && (
                    <span className="text-xs font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 px-3 py-1 rounded-lg">
                      {item.sub_category}
                    </span>
                  )}
                </div>

                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-800/50 px-3 py-1 rounded-lg">
                  Huruf: {item.letters}
                </span>
              </div>

              {/* Judul Nomor Makhraj */}
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                {item.title}
              </h2>

              {/* Penjelasan / Hartosna */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.explanation}
              </p>

              {/* Kotak Dalil Qoidah (Nadhom) */}
              <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  <ScrollText className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>Karena ceuk Qoidah:</span>
                </div>
                <p
                  dir="rtl"
                  className="text-right text-xl sm:text-2xl font-serif leading-loose text-sky-900 dark:text-sky-200"
                >
                  {item.example_arabic}
                </p>
                <p className="text-xs font-medium text-sky-700 dark:text-sky-400 italic border-t border-slate-200/60 dark:border-slate-700/60 pt-2">
                  {item.example_latin}
                </p>
              </div>

              {/* Cara Membaca / Praktek */}
              <div className="flex items-start gap-2 pt-1 text-xs text-slate-600 dark:text-slate-300">
                <BookCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p>
                  <strong className="font-semibold">Cara Praktek:</strong>{' '}
                  {item.how_to_read}
                </p>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}