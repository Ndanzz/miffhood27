'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Search, ArrowLeft, Plus, X, Loader2 } from 'lucide-react';
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

  // State untuk Modal & Form Tambah Doa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Harian',
    arabic: '',
    latin: '',
    translation: '',
    source: '',
  });

  const supabase = createClient();

  async function fetchDuas() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mh_duas')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setDuas(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDuas();
  }, []);

  // Fungsi Simpan Doa Baru ke Supabase
  const handleAddDua = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.arabic || !formData.translation) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase.from('mh_duas').insert([
        {
          title: formData.title,
          category: formData.category || 'Harian',
          arabic: formData.arabic,
          latin: formData.latin,
          translation: formData.translation,
          source: formData.source || null,
        },
      ]);

      if (error) {
        alert('Gagal menyimpan doa: ' + error.message);
      } else {
        // Reset form, tutup modal, dan muat ulang daftar doa
        setFormData({
          title: '',
          category: 'Harian',
          arabic: '',
          latin: '',
          translation: '',
          source: '',
        });
        setIsModalOpen(false);
        fetchDuas();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      {/* Header Bar */}
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

          {/* Tombol Buka Modal Tambah Doa */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-white text-amber-700 hover:bg-amber-50 font-semibold px-3.5 py-2 rounded-xl text-xs sm:text-sm shadow-sm transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Doa</span>
          </button>
        </div>

        {/* Search Input */}
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

        {/* Filter Kategori */}
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-4">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Memuat data doa...</p>
          </div>
        ) : filteredDuas.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3 shadow-sm">
            <p className="text-base font-semibold">Doa tidak ditemukan</p>
            <p className="text-xs text-slate-400">Belum ada data doa. Klik tombol &quot;Tambah Doa&quot; di kanan atas untuk mengisi doa pertama Anda.</p>
          </div>
        ) : (
          filteredDuas.map((dua) => (
            <div
              key={dua.id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-amber-400 transition"
            >
              {/* Top Tag Kategori & Source */}
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
              {dua.latin && (
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400 italic">
                  {dua.latin}
                </p>
              )}

              {/* Terjemahan */}
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                &quot;{dua.translation}&quot;
              </p>
            </div>
          ))
        )}
      </main>

      {/* Modal Form Tambah Doa Manual */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-lg font-bold">Tambah Do&apos;a Baru</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDua} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                  Judul Doa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Doa Sholat Dhuha"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Harian">Harian</option>
                    <option value="Sholat">Sholat</option>
                    <option value="Tidur">Tidur</option>
                    <option value="Keluarga">Keluarga</option>
                    <option value="Utama">Utama</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                    Sumber / Riwayat (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: HR. Bukhari"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                  Teks Arab *
                </label>
                <textarea
                  required
                  rows={3}
                  dir="rtl"
                  placeholder="Masukkan tulisan Arab di sini..."
                  value={formData.arabic}
                  onChange={(e) => setFormData({ ...formData, arabic: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-lg font-serif focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                  Bacaan Latin
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Allahumma innadh-dhuhaa'a dhuhaa'uka..."
                  value={formData.latin}
                  onChange={(e) => setFormData({ ...formData, latin: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                  Terjemahan Indonesia *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Masukkan arti doa..."
                  value={formData.translation}
                  onChange={(e) => setFormData({ ...formData, translation: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition shadow-sm"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Doa'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}