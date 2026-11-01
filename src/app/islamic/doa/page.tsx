'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Search, ArrowLeft, Heart, BookOpen } from 'lucide-react';

interface DuaItem {
  id: string;
  title: string;
  category: string;
  arabic: string;
  latin: string;
  translation: string;
  source?: string;
}

const DAILY_DUAS: DuaItem[] = [
  {
    id: '1',
    title: 'Doa Sebelum Makan',
    category: 'Harian',
    arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ',
    latin: 'Allahumma baarik lanaa fiimaa razaqtanaa wa qinaa \'adzaaban-naar.',
    translation: 'Ya Allah, berkahilah kami dalam rezeki yang telah Engkau berikan kepada kami dan peliharalah kami dari siksa api neraka.',
    source: 'HR. Ibn As-Sunni'
  },
  {
    id: '2',
    title: 'Doa Setelah Makan',
    category: 'Harian',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    latin: 'Alhamdu lillahilladzii ath\'amanaa wa saqaanaa wa ja\'alanaa muslimiin.',
    translation: 'Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami termasuk golongan orang-orang Muslim.',
    source: 'HR. Abu Daud'
  },
  {
    id: '3',
    title: 'Doa Sebelum Tidur',
    category: 'Tidur',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَحْيَا وَبِاسْمِكَ أَمُوتُ',
    latin: 'Bismika allahumma ahyaa wa bismika amuut.',
    translation: 'Dengan menyebut nama-Mu ya Allah, aku hidup dan dengan menyebut nama-Mu aku mati.',
    source: 'HR. Bukhari & Muslim'
  },
  {
    id: '4',
    title: 'Doa Bangun Tidur',
    category: 'Tidur',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    latin: 'Alhamdu lillahilladzii ahyaanaa ba\'da maa amaatanaa wa ilaihin-nusyuur.',
    translation: 'Segala puji bagi Allah yang telah menghidupkan kami kembali setelah mematikan kami, dan hanya kepada-Nya kami dikembalikan.',
    source: 'HR. Bukhari'
  },
  {
    id: '5',
    title: 'Doa Untuk Kedua Orang Tua',
    category: 'Keluarga',
    arabic: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    latin: 'Rabbighfir lii wa liwaalidayya warhamhumaa kamaa rabbayaanii shaghiiraa.',
    translation: 'Ya Rabbku, ampunilah aku dan kedua orang tuaku, dan kasihilah keduanya sebagaimana mereka telah merawatku sewaktu kecil.',
    source: 'QS. Al-Isra: 24'
  },
  {
    id: '6',
    title: 'Doa Kebaikan Dunia & Akhirat (Sapu Jagat)',
    category: 'Utama',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    latin: 'Rabbanaa aatinaa fid-dunyaa hasanatan wa fil-aakhirati hasanatan wa qinaa \'adzaaban-naar.',
    translation: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.',
    source: 'QS. Al-Baqarah: 201'
  }
];

export default function DoaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = ['Semua', 'Harian', 'Tidur', 'Keluarga', 'Utama'];

  const filteredDuas = DAILY_DUAS.filter((dua) => {
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
      {/* Header */}
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
                Kumpulan Do'a Harian
              </h1>
              <p className="text-xs text-amber-100">Doa-doa pilihan untuk amalan sehari-hari</p>
            </div>
          </div>
        </div>

        {/* Input Pencarian */}
        <div className="max-w-4xl mx-auto mt-4 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari doa (misal: Makan, Tidur, Orang Tua)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
          />
        </div>

        {/* Filter Kategori */}
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
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-4">
        {filteredDuas.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 text-center space-y-2">
            <p className="text-base font-semibold">Doa tidak ditemukan</p>
            <p className="text-xs text-slate-400">Coba kata kunci pencarian atau kategori lain.</p>
          </div>
        ) : (
          filteredDuas.map((dua) => (
            <div
              key={dua.id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-amber-400 transition"
            >
              {/* Header Item Doa */}
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

              {/* Judul Doa */}
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                {dua.title}
              </h3>

              {/* Teks Arab */}
              <div className="text-right py-2">
                <p className="text-2xl sm:text-3xl font-serif leading-loose text-amber-800 dark:text-amber-300">
                  {dua.arabic}
                </p>
              </div>

              {/* Transliterasi Latin */}
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400 italic">
                {dua.latin}
              </p>

              {/* Terjemahan Indonesia */}
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                "{dua.translation}"
              </p>
            </div>
          ))
        )}
      </main>
    </div>
  );
}