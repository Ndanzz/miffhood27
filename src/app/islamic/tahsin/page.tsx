'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mic, ArrowLeft, Search, BookCheck } from 'lucide-react';

interface TahsinMaterial {
  id: string;
  category: string;
  title: string;
  letters: string;
  explanation: string;
  exampleArabic: string;
  exampleLatin: string;
  howToRead: string;
}

const TAHSIN_DATA: TahsinMaterial[] = [
  {
    id: 'makhraj-1',
    category: 'Makharijul Huruf',
    title: 'Al-Jauf (Rongga Mulut & Tenggorokan)',
    letters: 'ا ، و ، ي (Huruf Mad)',
    explanation:
      'Suara keluar dari rongga tenggorokan hingga rongga mulut saat memanjangkan bacaan (Mad).',
    exampleArabic: 'نُوحِيهَا',
    exampleLatin: 'Nuuhiihaa',
    howToRead:
      'Dipanjangkan 2 harakat dengan aliran suara bersih tanpa tertahan di hidung (tidak mendengung).',
  },
  {
    id: 'makhraj-2',
    category: 'Makharijul Huruf',
    title: 'Al-Halq (Tenggorokan)',
    letters: 'ء ، هـ ، ع ، ح ، غ ، خ',
    explanation:
      'Terbagi 3 bagian: pangkal tenggorokan (ء، هـ), tengah tenggorokan (ع، ح), dan ujung tenggorokan (غ، خ).',
    exampleArabic: 'أَنْعَمْتَ عَلَيْهِمْ',
    exampleLatin: "An'amta 'alaihim",
    howToRead:
      'Huruf ع dan ح diucapkan jernih dari tengah tenggorokan, bukan dari rongga hidung atau dada.',
  },
  {
    id: 'makhraj-3',
    category: 'Makharijul Huruf',
    title: 'Al-Lisan (Lidah)',
    letters: 'ق ، ك ، ج ، ش ، ي ، ض ، ل ، ن ، ر ، ط ، د ، ت ، ص ، ز ، س ، ظ ، ذ ، ث',
    explanation:
      'Tempat keluarnya 18 huruf hijaiyah mulai dari pangkal lidah, tengah lidah, tepi lidah, hingga ujung lidah.',
    exampleArabic: 'وَلَا الضَّالِّينَ',
    exampleLatin: 'Wa ladh-dhaalliin',
    howToRead:
      'Huruf ض (Dhad) dikeluarkan dengan menempelkan salah satu atau kedua tepi lidah ke gigi geraham atas.',
  },
  {
    id: 'nun-1',
    category: 'Nun Sukun & Tanwin',
    title: 'Izhar Halqi (Bacaan Jelas)',
    letters: 'ء ، هـ ، ع ، ح ، غ ، خ',
    explanation:
      'Apabila Nun Sukun (نْ) atau Tanwin (ـً ـٍ ـٌ) bertemu salah satu dari 6 huruf tenggorokan.',
    exampleArabic: 'مَنْ آمَنَ — سَمِيعٌ عَلِيمٌ',
    exampleLatin: "Man aamana — Samii'un 'aliim",
    howToRead:
      'Bunyi N pada Nun Sukun/Tanwin dibaca jelas dan tegas tanpa dengung tambahan.',
  },
  {
    id: 'nun-2',
    category: 'Nun Sukun & Tanwin',
    title: 'Idgham Bighunnah (Melebur dengan Dengung)',
    letters: 'ي ، ن ، م ، و (يَنْمُو)',
    explanation:
      'Apabila Nun Sukun atau Tanwin bertemu huruf ي، ن، م، و dalam dua kata terpisah.',
    exampleArabic: 'مَنْ يَقُولُ — هُدًى وَرَحْمَةٌ',
    exampleLatin: 'May-yaquulu — Hudaw-wa rahmah',
    howToRead:
      'Bunyi Nun dileburkan ke huruf berikutnya disertai dengung (ghunnah) yang ditahan 2 harakat.',
  },
  {
    id: 'nun-3',
    category: 'Nun Sukun & Tanwin',
    title: 'Iqlab (Membalik Bunyi)',
    letters: 'ب',
    explanation:
      'Apabila Nun Sukun atau Tanwin bertemu huruf Ba (ب).',
    exampleArabic: 'مِنْ بَعْدِ — سَمِيعٌ بَصِيرٌ',
    exampleLatin: "Mim-ba'di — Samii'um-bashiir",
    howToRead:
      'Bunyi N diubah menjadi bunyi M ringan dengan merapatkan kedua bibir secara lembut dan mendengung 2 harakat.',
  },
  {
    id: 'nun-4',
    category: 'Nun Sukun & Tanwin',
    title: 'Ikhfa Haqiqi (Samar-samar)',
    letters: 'ت ، ث ، ج ، د ، ذ ، ز ، س ، ش ، ص ، ض ، ط ، ظ ، ف ، ق ، ك',
    explanation:
      'Apabila Nun Sukun atau Tanwin bertemu salah satu dari 15 huruf Ikhfa.',
    exampleArabic: 'مِنْ شَرِّ — أَنْفُسَكُمْ',
    exampleLatin: 'Min-syarri — Anfusakum',
    howToRead:
      'Bunyi N dibaca samar di antara Izhar dan Idgham, lidah bersiap menuju makhraj huruf berikutnya sambil berdengung 2 harakat.',
  },
  {
    id: 'mim-1',
    category: 'Hukum Mim Sukun',
    title: 'Ikhfa Syafawi & Idgham Mimi',
    letters: 'ب (Ikhfa Syafawi) & م (Idgham Mimi)',
    explanation:
      'Hukum bacaan saat Mim Sukun (مْ) bertemu huruf Ba (ب) atau huruf Mim berharakat (م).',
    exampleArabic: 'تَرْمِيهِمْ بِحِجَارَةٍ — لَهُمْ مَا يَشَاءُونَ',
    exampleLatin: 'Tarmiihim-bihijaarah — Lahum-maa yasyaa-uun',
    howToRead:
      'Kedua bibir dirapatkan dengan lembut disertai dengung yang ditahan selama 2 harakat.',
  },
  {
    id: 'qalqalah-1',
    category: 'Qalqalah & Mad',
    title: 'Qalqalah Sugra & Kubra (Pantulan)',
    letters: 'ق ، ط ، ب ، ج ، د (قُطْبُ جَدٍّ)',
    explanation:
      'Memantulkan suara saat huruf Qalqalah berharakat sukun (di tengah kata = Sugra, di akhir ayat/waqaf = Kubra).',
    exampleArabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    exampleLatin: 'Qul huwallaahu ahad(e)',
    howToRead:
      'Huruf د di akhir ayat dipantulkan dengan jelas tanpa menambah harakat vokal baru.',
  },
];

export default function TahsinPage() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'Semua',
    ...Array.from(new Set(TAHSIN_DATA.map((item) => item.category))),
  ];

  const filteredMaterials = TAHSIN_DATA.filter((item) => {
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
              Panduan makharijul huruf &amp; ilmu tajwid praktis
            </p>
          </div>
        </div>

        {/* Pencarian */}
        <div className="max-w-4xl mx-auto mt-4 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari materi tajwid atau huruf..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-inner"
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
                  ? 'bg-white text-sky-700 shadow-sm'
                  : 'bg-sky-700/40 text-sky-100 hover:bg-sky-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Daftar Materi Tahsin */}
      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-4">
        {filteredMaterials.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 text-center space-y-2">
            <p className="text-base font-semibold">Materi tidak ditemukan</p>
            <p className="text-xs text-slate-400">
              Coba gunakan kata kunci pencarian yang lain.
            </p>
          </div>
        ) : (
          filteredMaterials.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3.5 hover:border-sky-400 transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 px-3 py-1 rounded-lg">
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

              {/* Kotak Contoh Bacaan */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl p-4 space-y-2">
                <p className="text-right text-2xl font-serif leading-loose text-sky-800 dark:text-sky-300">
                  {item.exampleArabic}
                </p>
                <p className="text-xs font-semibold text-sky-700 dark:text-sky-400 italic">
                  {item.exampleLatin}
                </p>
              </div>

              {/* Cara Membaca */}
              <div className="flex items-start gap-2 pt-1 text-xs text-slate-600 dark:text-slate-300">
                <BookCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p>
                  <strong className="font-semibold">Cara Membaca:</strong>{' '}
                  {item.howToRead}
                </p>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}