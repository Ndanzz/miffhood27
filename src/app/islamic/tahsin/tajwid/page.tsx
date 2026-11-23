"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

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
  example_latin: string | null;
  how_to_read: string;
}

// Helper pengecekan apakah bab memiliki Qoidah asli
function hasQoidah(text?: string | null): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  if (!trimmed) return false;
  // Abaikan jika isinya hanya metadata sumber halaman kitab
  if (trimmed.startsWith("Kitab Tajwid Pegon Sunda")) return false;
  return true;
}

export default function KitabTajwidPage() {
  const [items, setItems] = useState<TahsinItem[]>([]);
  const [selectedFashal, setSelectedFashal] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTajwidOnly() {
      setLoading(true);
      const { data, error } = await supabase
        .from("mh_tahsin")
        .select("*")
        .not("category", "in", '("Makharijul Huruf","Sifatul Huruf")')
        .order("nomor", { ascending: true });

      if (!error && data) {
        const pureTajwid = data.filter((item) => {
          const cat = item.category.toLowerCase();
          return !cat.includes("makharij") && !cat.includes("sifatul");
        });
        setItems(pureTajwid);
      }
      setLoading(false);
    }
    fetchTajwidOnly();
  }, []);

  const tajwidFashals = [
    "Semua",
    ...Array.from(new Set(items.map((item) => item.category))),
  ];

  const filteredItems = items.filter((item) => {
    const matchFashal =
      selectedFashal === "Semua" || item.category === selectedFashal;

    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.explanation.toLowerCase().includes(q) ||
      (item.example_latin && item.example_latin.toLowerCase().includes(q)) ||
      item.letters.toLowerCase().includes(q);

    return matchFashal && matchSearch;
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {/* Header Khusus Kitab Tajwid */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
          Kitab Ilmu Tajwid
        </h1>
        <p className="mt-1 text-sm text-slate-600 sm:text-base dark:text-slate-400">
          Kumpulan hukum bacaan Al-Qur&apos;an (Fashal 1 s/d 13, Waqaf, Saktah,
          Isymam &amp; Imalah).
        </p>
      </div>

      {/* Pencarian */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari bab tajwid, hukum bacaan, huruf, atau qoidah..."
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-xs focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </div>

      {/* Filter Fashal Tajwid */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {tajwidFashals.map((fashal) => (
          <button
            key={fashal}
            onClick={() => setSelectedFashal(fashal)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedFashal === fashal
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            {fashal}
          </button>
        ))}
      </div>

      {/* Daftar Materi Tajwid */}
      {loading ? (
        <div className="py-12 text-center text-base text-slate-500">
          Memuat materi kitab tajwid...
        </div>
      ) : (
        <div className="space-y-6">
          {filteredItems.map((item) => (
            <article
              key={`${item.category}-${item.nomor}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {item.sub_category || item.category}
                </span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  #{item.nomor}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
                {item.title}
              </h2>

              {item.letters && (
                <div className="mt-3 rounded-lg bg-amber-50 px-3.5 py-2.5 text-base font-bold text-amber-950 sm:text-lg dark:bg-amber-950/40 dark:text-amber-200">
                  {item.letters}
                </div>
              )}

              <div className="mt-4 whitespace-pre-line text-base leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
                {item.explanation}
              </div>

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

              {/* KOLOM QOIDAH & NADHOM: HANYA MUNCUL JIKA ADA QOIDAH */}
              {hasQoidah(item.example_latin) && (
                <div className="mt-5 rounded-2xl border-2 border-emerald-600/80 bg-emerald-50/90 p-5 shadow-sm sm:p-6 dark:border-emerald-500/70 dark:bg-emerald-950/40">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-lg bg-emerald-700 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white">
                      Qoidah &amp; Nadhom
                    </span>
                  </div>

                  <p
                    dir="auto"
                    className="whitespace-pre-line text-xl font-semibold leading-[2] tracking-wide text-slate-900 sm:text-2xl dark:text-slate-100"
                  >
                    {item.example_latin}
                  </p>
                </div>
              )}

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