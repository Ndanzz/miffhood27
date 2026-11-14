'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Search, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface DuaItem {
  id: string;
  title: string;
  category: string;
  arabic: string;
  latin: string;
  translation: string;
  source?: string;
}

export default function DoaPage() {
  const [duas, setDuas] = useState<DuaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchDuas() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('mh_duas')
          .select('*')
          .order('created_at', { ascending: true });

        if (!error && data) {
          setDuas(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDuas();
  }, []);

  const categories = ['Semua', ...Array.from(new Set(duas.map((d) => d.category)))];

  const filteredDuas = duas.filter((dua) => {
    const matchesSearch =
      dua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.translation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Semua' || dua.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-24 transition-colors duration-300">
      <header className="sticky top-0 z-10 bg-amber-600 dark:bg-amber-900 text-white px-4 py-4 shadow-md backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-amber-700/50 hover:bg-amber-700 transition"
              aria-label="Kembali ke Beranda"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-200" />
                Kumpulan Do&apos;a Harian
              </h1>
              <p className="text-xs text-amber-100">Doa-doa pilihan untuk amalan sehari-hari</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-4 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari doa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
          />
        </div>

        {categories.length > 1 && (
          <div className="max-w-4xl mx-auto mt-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                  selectedCategory === cat
                    ? 'bg-white text-amber-700 shadow-sm'
                    : 'bg-amber-700/40 text-amber-100 hover:bg-amber-700/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-4">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Memuat data doa...</p>
          </div>
        ) : filteredDuas.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 text-center space-y-2 shadow-sm">
            <p className="text-base font-semibold">Doa tidak ditemukan</p>
            <p className="text-xs text-slate-400">Belum ada data doa di database Supabase.</p>
          </div>
        ) : (
          filteredDuas.map((dua) => (
            <div
              key={dua.id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-amber-400 transition"
            >
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                <span className="text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-lg">
                  {dua.category}
                </span>
                {dua.source && (
                  <span className="text-[11px] text-slate-400 italic">
                    {dua.source}
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                {dua.title}
              </h3>

              <div className="text-right py-2">
                <p className="text-2xl sm:text-3xl font-serif leading-loose text-amber-800 dark:text-amber-300">
                  {dua.arabic}
                </p>
              </div>

              {dua.latin && (
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400 italic">
                  {dua.latin}
                </p>
              )}

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                &quot;{dua.translation}&quot;
              </p>
            </div>
          ))
        )}
      </main>
    </div>
  );
}