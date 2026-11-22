'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpenCheck, ArrowLeft, Search, BookCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface TajwidMaterial {
  id: string;
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
  const [selectedCategory, setSelectedCategory] = useState('Semua');
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
          .order('created_at', { ascending: true });

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
    'Semua',
    ...Array.from(new Set(materials.map((item) => item.category))),
  ];

  const filteredMaterials = materials.filter((item) => {
    const matchesCategory =
      selectedCategory === 'Semua' || item.category === selectedCategory;

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.letters.toLowerCase().includes(searchQuery.toLowerCase());

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
              Tajwid Al-Qur&apos;an
            </h1>
            <p className="text-xs text-indigo-100">
              Hukum bacaan nun sukun, mim sukun, qalqalah &amp; mad
            </p>
          </div>
        </div>

        {/* Input Pencarian */}
        <div className="max-w-4xl mx-auto mt-4 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari hukum tajwid atau huruf..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-inner"
          />
        </div>

        {/* Filter Kategori Hukum Tajwid */}
        {categories.length > 1 && (
          <div className="max-w-4xl mx-auto mt-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                  selectedCategory === cat
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'bg-indigo-700/40 text-indigo-100 hover:bg-indigo-700/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Daftar Materi Tajwid */}
      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-4">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Memuat materi Tajwid...
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
              Belum ada materi tajwid atau kata kunci tidak cocok.
            </p>
          </div>
        ) : (
          filteredMaterials.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3.5 hover:border-indigo-400 transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-lg">
                  {item.category}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                  Huruf: {item.letters}
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                {item.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.explanation}
              </p>

              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl p-4 space-y-2">
                <p className="text-right text-2xl font-serif leading-loose text-indigo-800 dark:text-indigo-300">
                  {item.example_arabic}
                </p>
                <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 italic">
                  {item.example_latin}
                </p>
              </div>

              <div className="flex items-start gap-2 pt-1 text-xs text-slate-600 dark:text-slate-300">
                <BookCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p>
                  <strong className="font-semibold">Cara Membaca:</strong>{' '}
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