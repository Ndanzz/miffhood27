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
  example_latin: string;
  how_to_read: string;
}

type MainSection = "Makharijul Huruf" | "Sifatul Huruf" | "Ilmu Tajwid";

function renderQoidahContent(text: string) {
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
            className="rounded-lg border border-emerald-200/80 bg-white px-4 py-3 text-right font-serif text-2xl font-bold leading-[2.2] text-emerald-950 shadow-xs sm:text-3xl dark:border-emerald-800/60 dark:bg-slate-900/90 dark:text-emerald-200"
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
  const [mainSection, setMainSection] = useState<MainSection>("Ilmu Tajwid");
  const [selectedFashal, setSelectedFashal] = useState<string>("Semua");
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

  // Pisahkan data berdasarkan 3 bagian utama
  const sectionItems = items.filter((item) => {
    if (mainSection === "Makharijul Huruf") {
      return item.category === "Makharijul Huruf";
    }
    if (mainSection === "Sifatul Huruf") {
      return item.category === "Sifatul Huruf";
    }
    // Selain Makhraj & Sifatul Huruf masuk ke Ilmu Tajwid (Fashal 1 - 13 & Waqaf)
    return (
      item.category !== "Makharijul Huruf" &&
      item.category !== "Sifatul Huruf"
    );
  });

  // Sub-filter Fashal khusus untuk tab Ilmu Tajwid
  const tajwidFashals = [
    "Semua",
    ...Array.from(new Set(sectionItems.map((item) => item.category))),
  ];

  const filteredItems = sectionItems.filter((item) => {
    const matchFashal =
      mainSection !== "Ilmu Tajwid" ||
      selectedFashal === "Semua" ||
      item.category === selectedFashal;

    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.explanation.toLowerCase().includes(q) ||
      item.example_latin.toLowerCase().includes(q) ||
      item.letters.toLowerCase().includes(q);

    return matchFashal && matchSearch;
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
          Modul Tahsin &amp; Ilmu Tajwid
        </h1>
        <p className="mt-1 text-sm text-slate-600 sm:text-base dark:text-slate-400">
          Pilih bagian materi: Makharijul Huruf, Sifatul Huruf, atau Kitab
          Tajwid.
        </p>
      </div>

      {/* 3 TAB UTAMA PEMISAH */}
      <div className="mb-5 grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800">
        {(["Makharijul Huruf", "Sifatul Huruf", "Ilmu Tajwid"] as MainSection[]).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => {
                setMainSection(tab);
                setSelectedFashal("Semua");
              }}
              className={`rounded-xl px-3 py-2.5 text-xs font-bold transition sm:text-sm ${
                mainSection === tab
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-700 hover:bg-white/60 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Pencarian */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Cari di dalam ${mainSection}...`}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-xs focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </div>

      {/* Filter Fashal (Hanya muncul saat tab Ilmu Tajwid aktif) */}
      {mainSection === "Ilmu Tajwid" && (
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
      )}

      {/* Daftar Materi */}
      {loading ? (
        <div className="py-12 text-center text-base text-slate-500">
          Memuat materi...
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