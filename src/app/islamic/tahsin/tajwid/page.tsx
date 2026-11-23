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
  example_arabic: string | null;
  example_latin: string | null;
  how_to_read: string | null;
}

type FontScale = "normal" | "large" | "xlarge";

function hasQoidah(text?: string | null): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("Kitab Tajwid Pegon Sunda")) return false;
  return true;
}

export default function KitabTajwidPage() {
  const [items, setItems] = useState<TahsinItem[]>([]);
  const [selectedFashal, setSelectedFashal] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [fontScale, setFontScale] = useState<FontScale>("large");
  const [loading, setLoading] = useState<boolean>(true);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

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

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      (item.example_arabic && item.example_arabic.toLowerCase().includes(q)) ||
      item.letters.toLowerCase().includes(q);

    return matchFashal && matchSearch;
  });

  // Pengaturan ukuran teks Arab & Qoidah dinamis
  const arabicFontClass = {
    normal: "text-xl sm:text-2xl leading-[2.1]",
    large: "text-2xl sm:text-3xl leading-[2.35]",
    xlarge: "text-3xl sm:text-4xl leading-[2.5]",
  }[fontScale];

  return (
    <div className="min-h-screen bg-stone-50/70 pb-16 dark:bg-slate-950">
      {/* HERO HEADER NUANSA KITAB & MUSHAF */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 px-4 pt-8 pb-10 text-white shadow-md sm:px-6">
        {/* Ornamen Latar Belakang Halus */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-950/50 px-3.5 py-1 text-xs font-semibold tracking-wide text-emerald-200 backdrop-blur-xs">
              <span>۞</span> Kitab Digital Pegon Sunda
            </span>

            {/* Kontrol Ukuran Huruf Arab/Pegon */}
            <div className="flex items-center gap-1 rounded-full border border-white/15 bg-black/20 p-1 text-xs backdrop-blur-xs">
              <span className="px-2 text-emerald-200/80">Ukuran Arab:</span>
              {(
                [
                  { id: "normal", label: "A" },
                  { id: "large", label: "A+" },
                  { id: "xlarge", label: "A++" },
                ] as { id: FontScale; label: string }[]
              ).map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setFontScale(btn.id)}
                  className={`rounded-full px-2.5 py-1 font-bold transition ${
                    fontScale === btn.id
                      ? "bg-amber-400 text-emerald-950 shadow-xs"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <h1 className="mt-4 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Kitab Ilmu Tajwid Lengkap
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-emerald-100/90 sm:text-base">
            Panduan kaidah bacaan Al-Qur&apos;an ti Muqaddimah dugi ka Tamat
            (Fashal 1–13, Waqaf, Saktah, Isymam &amp; Imalah) lengkap sareng
            matan qoidah tur nadhom Pegon Sunda.
          </p>

          {/* Info Ringkas */}
          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-medium text-emerald-200">
            <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5">
              <span className="font-bold text-amber-300">{items.length}</span>
              <span>Bab Materi</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5">
              <span className="font-bold text-amber-300">
                {tajwidFashals.length - 1}
              </span>
              <span>Fashal &amp; Pembahasan</span>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY SEARCH & FILTER BAR */}
      <div className="sticky top-0 z-20 border-b border-stone-200/80 bg-white/90 px-4 py-3.5 shadow-xs backdrop-blur-md sm:px-6 dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto max-w-4xl space-y-3">
          {/* Kolom Pencarian */}
          <div className="relative">
            <svg
              className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari hukum tajwid, huruf, contoh lafadz, atawa qoidah..."
              className="w-full rounded-xl border border-stone-300 bg-stone-50/80 py-2.5 pr-10 pl-11 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 sm:text-base dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Hapus pencarian"
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Pill Filter Fashal */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {tajwidFashals.map((fashal) => {
              const active = selectedFashal === fashal;
              return (
                <button
                  key={fashal}
                  onClick={() => setSelectedFashal(fashal)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition sm:text-sm ${
                    active
                      ? "bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-700/20"
                      : "border border-stone-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {fashal}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <main className="mx-auto mt-6 max-w-4xl px-4 sm:px-6">
        {loading ? (
          /* Skeleton Loading yang Halus */
          <div className="space-y-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="animate-pulse rounded-3xl border border-stone-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="h-4 w-32 rounded-full bg-stone-200 dark:bg-slate-800" />
                <div className="mt-4 h-7 w-3/4 rounded-lg bg-stone-200 dark:bg-slate-800" />
                <div className="mt-4 h-20 rounded-xl bg-stone-100 dark:bg-slate-800/60" />
                <div className="mt-4 h-32 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          /* Tampilan Jika Pencarian Kosong */
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
            <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
              Materi teu kapendak
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Cobian kata kunci sanes atawa pilih kategori &quot;Semua&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedFashal("Semua");
              }}
              className="mt-4 rounded-xl bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Tampilkan Semua Bab
            </button>
          </div>
        ) : (
          <div className="space-y-7">
            {filteredItems.map((item) => (
              <article
                key={`${item.category}-${item.nomor}`}
                className="group relative overflow-hidden rounded-3xl border border-stone-200/90 bg-white p-5 shadow-sm transition hover:border-emerald-300/80 hover:shadow-md sm:p-7 dark:border-slate-800 dark:bg-slate-900"
              >
                {/* Aksen Garis Atas Halus */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-400 opacity-80" />

                {/* Header Kartu: Sub-Kategori & Nomor */}
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    {item.sub_category || item.category}
                  </span>

                  <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-stone-100 px-2.5 text-xs font-extrabold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {item.nomor}
                  </span>
                </div>

                {/* Judul Bab */}
                <h2 className="text-xl font-extrabold leading-snug text-slate-900 sm:text-2xl dark:text-white">
                  {item.title}
                </h2>

                {/* Kotak Ketentuan Huruf (Aksen Emas/Amber) */}
                {item.letters && item.letters.trim() !== "" && (
                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50/60 px-4 py-3 text-amber-950 dark:border-amber-800/50 dark:from-amber-950/40 dark:to-amber-900/20 dark:text-amber-200">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-sm font-bold text-amber-800 dark:text-amber-300">
                      ح
                    </span>
                    <span className="text-base font-bold sm:text-lg">
                      {item.letters}
                    </span>
                  </div>
                )}

                {/* Penjelasan / Patokan */}
                <div className="mt-4 whitespace-pre-line text-base leading-[1.85] text-slate-700 sm:text-[17px] dark:text-slate-300">
                  {item.explanation}
                </div>

                {/* Kotak Conto Lafadz (Nuansa Kertas Mushaf Krem Lembut) */}
                {item.example_arabic && item.example_arabic.trim() !== "" && (
                  <div className="mt-5 rounded-2xl border border-stone-200/90 bg-[#fcfaf5] p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-950/70">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-stone-500 dark:text-slate-400">
                        Conto Lafadz Al-Qur&apos;an
                      </span>
                      <span className="text-xs text-stone-400">۞</span>
                    </div>
                    <p
                      dir="rtl"
                      className={`whitespace-pre-line text-right font-serif font-bold text-slate-900 dark:text-white ${arabicFontClass}`}
                    >
                      {item.example_arabic}
                    </p>
                  </div>
                )}

                {/* BLOK QOIDAH & NADHOM (ARAB + PEGON SUNDA BERBINGKAI KLASIK) */}
                {hasQoidah(item.example_latin) && (
                  <div className="relative mt-6 overflow-hidden rounded-2xl border-2 border-emerald-600/75 bg-gradient-to-b from-emerald-50/95 to-teal-50/70 p-5 shadow-xs sm:p-6 dark:border-emerald-500/60 dark:from-emerald-950/60 dark:to-teal-950/40">
                    <div className="mb-3 flex items-center justify-between border-b border-emerald-600/15 pb-2.5">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-2xs">
                        <span>۞</span> Qoidah &amp; Nadhom
                      </span>
                      <span className="font-serif text-sm font-bold text-emerald-800/70 dark:text-emerald-300/70">
                        قَاعِدَةُ التَّجْوِيْدِ
                      </span>
                    </div>

                    <p
                      dir="rtl"
                      className={`whitespace-pre-line text-right font-serif font-bold text-slate-900 dark:text-slate-100 ${arabicFontClass}`}
                    >
                      {item.example_latin}
                    </p>
                  </div>
                )}

                {/* Ringkasan Cara Baca */}
                {item.how_to_read && item.how_to_read.trim() !== "" && (
                  <div className="mt-5 flex items-start gap-3 rounded-2xl border border-sky-200/70 bg-sky-50/70 p-4 text-sm leading-relaxed text-sky-950 sm:text-base dark:border-sky-800/40 dark:bg-sky-950/30 dark:text-sky-200">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
                      ✓
                    </span>
                    <div>
                      <span className="font-extrabold">Cara Maca: </span>
                      <span>{item.how_to_read}</span>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Tombol Kembali ke Atas */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Kembali ke atas"
          className="fixed right-5 bottom-6 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-700 text-lg font-bold text-white shadow-lg transition hover:bg-emerald-800 active:scale-95"
        >
          ↑
        </button>
      )}
    </div>
  );
}