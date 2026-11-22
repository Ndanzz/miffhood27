'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AudioWaveform,
  ArrowLeft,
  Search,
  BookCheck,
  Layers,
  ScrollText,
  Info,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface SifatMaterial {
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

export default function SifatulHurufPage() {
  const [materials, setMaterials] = useState<SifatMaterial[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('Semua (Runtut 1–17)');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchSifat() {
      try {
        setLoading(true);
        setErrorMsg(null);

        const { data, error } = await supabase
          .from('mh_tahsin')
          .select('*')
          .eq('category', 'Sifatul Huruf')
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
          setErrorMsg('Gagal memuat data Sifatul Huruf dari Supabase.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchSifat();
  }, []);

  const subCategories = [
    'Semua (Runtut 1–17)',
    '1. Sifat yang Memiliki Lawan',
    '2. Sifat yang Tidak Memiliki Lawan',
  ];

  const filteredMaterials = materials.filter((item) => {
    const matchesSubCategory =
      selectedSubCategory === 'Semua (Runtut 1–17)' ||
      item.sub_category === selectedSubCategory;

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.letters.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.sub_category &&
        item.sub_category.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSubCategory && matchesSearch;
  });

  const groupedSections = [
    {
      heading: 'Bagian 1: Sifat yang Memiliki Lawan (Dzawatul Addad)',
      subtitle: 'Terdiri dari 5 pasang sifat yang saling berlawanan (No. 1 – 10)',
      items: filteredMaterials.filter(
        (m) => m.sub_category === '1. Sifat yang Memiliki Lawan'
      ),
    },
    {
      heading: 'Bagian 2: Sifat yang Tidak Memiliki Lawan (Ghairu Dzawatil Addad)',
      subtitle: 'Terdiri dari 7 sifat tunggal tanpa lawan kata (No. 11 – 17)',
      items: filteredMaterials.filter(
        (m) => m.sub_category === '2. Sifat yang Tidak Memiliki Lawan'
      ),
    },
  ].filter((sec) => sec.items.length > 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-24 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-emerald-600 dark:bg-emerald-900 text-white px-4 py-4 shadow-md backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link
            href="/islamic/tahsin"
            className="p-2 rounded-xl bg-emerald-700/50 hover:bg-emerald-700 transition"
            aria-label="Kembali ke Menu Tahsin"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <AudioWaveform className="w-5 h-5 text-emerald-200" />
              Sifatul Huruf (17 Sifat)
            </h1>
            <p className="text-xs text-emerald-100">
              Pembagian sifat yang berlawanan &amp; sifat yang tidak berlawanan
            </p>
          </div>
        </div>

        {/* Input Pencarian */}
        <div className="max-w-4xl mx-auto mt-4 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari sifat huruf (misal: Hams, Syiddah, Qalqalah, Shafir)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-inner"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-5 space-y-5">
        {/* Kartu Ringkasan Pembagian Sifatul Huruf */}
        <section className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/70 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
            <Info className="w-4 h-4 shrink-0" />
            <span>Pembagian Sifatul Huruf Menurut Muqaddimah Jazariyah</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="font-bold text-slate-800 dark:text-slate-100">
                1. Sifat yang Memiliki Lawan (10 Sifat)
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Hams ⇄ Jahr, Syiddah &amp; Tawassuth ⇄ Rakhawah, Isti&apos;la ⇄ Istifal, Ithbaq ⇄ Infitah, Idzlaq ⇄ Ishmat.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="font-bold text-slate-800 dark:text-slate-100">
                2. Sifat yang Tidak Memiliki Lawan (7 Sifat)
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Shafir, Qalqalah, Lin, Inhiraf, Takrir, Tafasysyi, dan Istithalah.
              </p>
            </div>
          </div>
        </section>

        {/* Filter 2 Kelompok Utama */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 shadow-sm space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 px-1">
            <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Tampilkan Bagian:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {subCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubCategory(sub)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                  selectedSubCategory === sub
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Daftar Materi Runtut Terkelompok */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Memuat materi Sifatul Huruf...
            </p>
          </div>
        ) : errorMsg ? (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center space-y-2">
            <p className="text-sm font-bold text-red-600 dark:text-red-400">
              Gagal Memuat Data
            </p>
            <p className="text-xs text-red-500 font-mono break-all">{errorMsg}</p>
          </div>
        ) : groupedSections.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 text-center space-y-2">
            <p className="text-base font-semibold">Materi tidak ditemukan</p>
            <p className="text-xs text-slate-400">
              Belum ada data pada bagian ini atau kata kunci tidak cocok.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedSections.map((section) => (
              <section key={section.heading} className="space-y-4">
                {/* Judul Pemisah Bagian */}
                <div className="border-l-4 border-emerald-600 pl-3 py-0.5">
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-slate-100">
                    {section.heading}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {section.subtitle}
                  </p>
                </div>

                {/* Kartu Item Runtut */}
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3.5 hover:border-emerald-400 transition"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-lg">
                          {item.sub_category}
                        </span>

                        <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-800/50 px-3 py-1 rounded-lg">
                          Huruf: {item.letters}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.explanation}
                      </p>

                      {/* Kotak Dalil Qoidah */}
                      <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70 rounded-xl p-4 space-y-2">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          <ScrollText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Karena ceuk Qoidah:</span>
                        </div>
                        <p
                          dir="rtl"
                          className="text-right text-xl sm:text-2xl font-serif leading-loose text-emerald-900 dark:text-emerald-200"
                        >
                          {item.example_arabic}
                        </p>
                        <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 italic border-t border-slate-200/60 dark:border-slate-700/60 pt-2">
                          {item.example_latin}
                        </p>
                      </div>

                      {/* Cara Praktek */}
                      <div className="flex items-start gap-2 pt-1 text-xs text-slate-600 dark:text-slate-300">
                        <BookCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <p>
                          <strong className="font-semibold">Cara Praktek:</strong>{' '}
                          {item.how_to_read}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}