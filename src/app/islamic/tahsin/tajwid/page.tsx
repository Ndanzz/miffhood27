'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpenCheck,
  ArrowLeft,
  Search,
  BookCheck,
  ScrollText,
  Layers,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface TajwidMaterial {
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

export default function TajwidPage() {
  const [materials, setMaterials] = useState<TajwidMaterial[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Sadayana Fashal');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchTajwid() {
      try {
        setLoading(true);
        setErrorMsg(null);

        const { data, error } = await supabase
          .from('mh_tahsin')
          .select('*')
          .not('category', 'in', '("Makharijul Huruf","Sifatul Huruf")')
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
          setErrorMsg('Gagal memuat data Tajwid dari Supabase.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchTajwid();
  }, []);

  const categories = [
    'Sadayana Fashal',
    ...Array.from(new Set(materials.map((item) => item.category))),
  ];

  const filteredMaterials = materials.filter((item) => {
    const matchesCategory =
      selectedCategory === 'Sadayana Fashal' || item.category === selectedCategory;

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.letters.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.example_latin.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-24 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-indigo-600 dark:bg-indigo-900 text-white px-4 py-4 shadow-md backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link
            href="/islamic/tahsin"
            className="p-2 rounded-xl bg-indigo-700/50 hover:bg-indigo-700 transition"
            aria-label="Kembali ke Menu Tahsin"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <BookOpenCheck className="w-5 h-5 text-indigo-200" />
              Kitab Tajwid Al-Qur&apos;an
            </h1>
            <p className="text-xs text-indigo-100">
              Ta&apos;rif, patokan, conto lafaz, sareng nadhom qoidah
            </p>
          </div>
        </div>

        {/* Input Pencarian */}
        <div className="max-w-4xl mx-auto mt-4 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Pilari fashal, hukum tajwid, huruf, atanapi qoidah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-inner"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-5 space-y-5">
        {/* Filter Fashal / Bab */}
        {categories.length > 1 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 shadow-sm space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 px-1">
              <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Pilih Fashal / Bab Kitab:</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Daftar Materi Tajwid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Ngamuat materi kitab Tajwid...
            </p>
          </div>
        ) : errorMsg ? (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center space-y-2">
            <p className="text-sm font-bold text-red-600 dark:text-red-400">
              Gagal Ngamuat Data
            </p>
            <p className="text-xs text-red-500 font-mono break-all">{errorMsg}</p>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 text-center space-y-2">
            <p className="text-base font-semibold">Materi teu kapendak</p>
            <p className="text-xs text-slate-400">
              Teu acan aya data dina fashal ieu atanapi kecap pilarian teu cocog.
            </p>
          </div>
        ) : (
          filteredMaterials.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3.5 hover:border-indigo-400 transition"
            >
              {/* Lencana Fashal & Huruf/Keterangan */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-lg">
                  {item.sub_category || item.category}
                </span>

                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-800/50 px-3 py-1 rounded-lg">
                  {item.letters}
                </span>
              </div>

              {/* Judul Materi */}
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                {item.title}
              </h2>

              {/* Penjelasan & Patokan (Format Baris-per-Baris) */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {item.explanation}
              </p>

              {/* Kotak Conto Lafaz Arab & Dalil Qoidah */}
              <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  <ScrollText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Conto Lafaz &amp; Dalil Qoidah:</span>
                </div>
                <p
                  dir="rtl"
                  className="text-right text-lg sm:text-xl font-serif leading-loose text-indigo-900 dark:text-indigo-200 whitespace-pre-line"
                >
                  {item.example_arabic}
                </p>
                <p className="text-xs font-medium text-indigo-700 dark:text-indigo-400 italic border-t border-slate-200/60 dark:border-slate-700/60 pt-2 whitespace-pre-line">
                  {item.example_latin}
                </p>
              </div>

              {/* Catetan / Cara Maca */}
              <div className="flex items-start gap-2 pt-1 text-xs text-slate-600 dark:text-slate-300">
                <BookCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="whitespace-pre-line">{item.how_to_read}</p>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}