"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase Client (sesuaikan jika sudah punya helper di lib/supabase.ts)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface TahsinItem {
  id?: number;
  nomor: number;
  category: string;
  sub_category: string;
  title: string;
  letters: string;
  explanation: string;
  example_arabic: string;
  example_latin: string;
  how_to_read: string;
}

/**
 * Helper untuk memisahkan teks Arab di dalam tanda kutip ("...") pada qoidah
 * dengan nadhom/penjelasan Sunda-nya agar masing-masing tampil optimal.
 */
function renderQoidahContent(text: string) {
  // Pisahkan bagian matan Arab di dalam tanda kutip jika ada
  const arabicQuoteRegex = /"([^"]*[\u0600-\u06FF]+[^"]*)"/g;
  const parts: { type: "arabic" | "latin"; content: string }[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = arabicQuoteRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const before = text.slice(lastIndex, match.index).trim();
      if (before) parts.push({ type: "latin", content: before });
    }
    parts.push({ type: "arabic", content: match[1].trim() });
    lastIndex = arabicQuoteRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex).trim();
    if (remaining) parts.push({ type: "latin", content: remaining });
  }

  if (parts.length === 0) {
    return (
      <p className="whitespace-pre-line text-lg font-semibold leading-relaxed text-slate-900 sm:text-xl dark:text-slate-100">
        {text}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {parts.map((part, idx) =>
        part.type === "arabic" ? (
          <div
            key={idx}
            dir="rtl"
            className="rounded-lg border border-emerald-200/80 bg-white px-4 py-3 text-right font-serif text-2xl font-bold leading-[2.2] tracking-normal text-emerald-950 shadow-xs sm:text-3xl dark:border-emerald-800/60 dark:bg-slate-900/90 dark:text-emerald-200"
          >
            {part.content}
          </div>
        ) : (
          <p
            key={idx}
            className="whitespace-pre-line text-lg font-semibold leading-relaxed tracking-wide text-slate-900 sm:text-xl dark:text-slate-100"
          >
            {part.content}
          </p>
        )
      )}
    </div>
  );
}

export default function TahsinTajwidPage() {
  const [items, setItems] = useState<TahsinItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTahsin() {
      setLoading(true);
      const { data, error } = await supabase
        .from("mh_tahsin")
        .select("*")
        .order("nomor", { ascending: true });

      if (!error && data) {
        setItems(data);
      }
      setLoading(false);
    }
    fetchTahsin();
  }, []);

  const categories = [
    "Semua",
    ...Array.from(new Set(items.map((item) => item.category))),
  ];

  const filteredItems = items.filter((item) => {
    const matchCategory =
      selectedCategory === "Semua" || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.explanation.toLowerCase().includes(q) ||
      item.example_latin.toLowerCase().includes(q) ||
      item.letters.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
          Kitab Tajwid & Tahsin
        </h1>
        <p className="mt-1 text-sm text-slate-600 sm:text-base dark:text-slate-400">
          Panduan lengkap hukum bacaan Al-Qur&apos;an, matan qoidah, sarta nadhom
          Sunda.
        </p>
      </div>

      {/* Pencarian & Filter Kategori */}
      <div className="mb-6 space-y-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari bab, hukum bacaan, huruf, atau qoidah..."
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-xs focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Daftar Materi */}
      {loading ? (
        <div className="py-12 text-center text-base text-slate-500">
          Memuat materi tajwid...
        </div>
      ) : (
        <div className="space-y-6">
          {filteredItems.map((item) => (
            <article
              key={item.nomor}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Badge Sub-Kategori & Nomor */}
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {item.sub_category}
                </span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  #{item.nomor}
                </span>
              </div>

              {/* Judul Bab */}
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
                {item.title}
              </h2>

              {/* Huruf / Ketentuan Kunci */}
              {item.letters && (
                <div className="mt-3 rounded-lg bg-amber-50 px-3.5 py-2.5 text-base font-bold text-amber-950 sm:text-lg dark:bg-amber-950/40 dark:text-amber-200">
                  {item.letters}
                </div>
              )}

              {/* Penjelasan / Patokan */}
              <div className="mt-4 whitespace-pre-line text-base leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
                {item.explanation}
              </div>

              {/* Contoh Lafadz Arab */}
              {item.example_arabic && (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Conto Lafadz
                  </div>
                  <p
                    dir="rtl"
                    className="whitespace-pre-line text-right font-serif text-2xl font-bold leading-[2.2] text-slate-900 sm:text-3xl dark:text-white"
                  >
                    {item.example_arabic}
                  </p>
                </div>
              )}

              {/* BLOK QOIDAH & NADHOM (BESAR & JELAS) */}
              {item.example_latin && (
                <div className="mt-5 rounded-2xl border-2 border-emerald-600/80 bg-emerald-50/90 p-5 shadow-sm sm:p-6 dark:border-emerald-500/70 dark:bg-emerald-950/40">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-lg bg-emerald-700 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white">
                      Qoidah &amp; Nadhom
                    </span>
                  </div>
                  {renderQoidahContent(item.example_latin)}
                </div>
              )}

              {/* Cara Baca / Ringkasan Praktik */}
              {item.how_to_read && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-sky-50/80 p-3.5 text-sm font-medium leading-relaxed text-sky-950 sm:text-base dark:bg-sky-950/40 dark:text-sky-200">
                  <span className="font-bold">Cara Maca:</span>
                  <span>{item.how_to_read}</span>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}