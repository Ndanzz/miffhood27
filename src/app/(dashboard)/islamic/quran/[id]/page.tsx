'use client';

import React, { useState, useEffect, use } from 'react';
import { ArrowLeft, Bookmark, Volume2, VolumeX, Check, Info } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Ayah {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

interface SurahDetail {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
  ayat: Ayah[];
}

export default function DetailSurahPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const surahId = resolvedParams.id;

  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<number[]>([]);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchSurahDetail() {
      try {
        setLoading(true);
        const res = await fetch(`https://equran.id/api/v2/surat/${surahId}`);
        if (!res.ok) throw new Error('Gagal memuat detail surah');
        const data = await res.json();
        setSurah(data.data);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat memuat ayat.');
      } finally {
        setLoading(false);
      }
    }

    fetchSurahDetail();
  }, [surahId]);

  // Fungsi toggle audio per ayat
  const handlePlayAudio = (url: string) => {
    if (audioObj) {
      audioObj.pause();
    }

    if (playingAudio === url) {
      setPlayingAudio(null);
      setAudioObj(null);
    } else {
      const newAudio = new Audio(url);
      newAudio.play();
      setPlayingAudio(url);
      setAudioObj(newAudio);

      newAudio.onended = () => {
        setPlayingAudio(null);
        setAudioObj(null);
      };
    }
  };

  // Fungsi toggle bookmark ke Supabase (mh_user_bookmarks)
  const toggleBookmark = async (nomorAyat: number, teksArab: string, teksLatin: string) => {
    const isBookmarked = bookmarkedAyahs.includes(nomorAyat);
    const referenceId = `surah_${surahId}_ayah_${nomorAyat}`;

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      alert('Silakan login terlebih dahulu untuk menyimpan bookmark.');
      return;
    }

    if (isBookmarked) {
      // Hapus dari Supabase
      const { error } = await supabase
        .from('mh_user_bookmarks')
        .delete()
        .eq('user_id', session.user.id)
        .eq('reference_id', referenceId);

      if (!error) {
        setBookmarkedAyahs((prev) => prev.filter((id) => id !== nomorAyat));
      }
    } else {
      // Tambah ke Supabase
      const { error } = await supabase
        .from('mh_user_bookmarks')
        .insert({
          user_id: session.user.id,
          item_type: 'quran_verse',
          reference_id: referenceId,
          meta_data: {
            surah_nomor: surahId,
            surah_nama: surah?.namaLatin,
            ayah_nomor: nomorAyat,
            teks_arab: teksArab,
            teks_latin: teksLatin,
          },
        });

      if (!error) {
        setBookmarkedAyahs((prev) => [...prev, nomorAyat]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-24 transition-colors duration-300">
      {/* Header Sticky */}
      <header className="sticky top-0 z-10 bg-emerald-600 dark:bg-emerald-900 text-white px-4 py-4 shadow-md backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/islamic/quran"
              className="p-2 rounded-xl bg-emerald-700/50 hover:bg-emerald-700 transition dark:bg-emerald-800/50"
              aria-label="Kembali ke Daftar Surah"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                {surah ? surah.namaLatin : 'Memuat Surah...'}
              </h1>
              {surah && (
                <p className="text-xs text-emerald-100">
                  {surah.arti} • {surah.jumlahAyat} Ayat
                </p>
              )}
            </div>
          </div>
          {surah && (
            <span className="text-2xl font-serif text-emerald-200">
              {surah.nama}
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {loading && (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Memuat teks ayat Al-Qur'an...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 p-4 rounded-2xl text-center text-sm">
            {error}
          </div>
        )}

        {surah && (
          <>
            {/* Card Hero Banner Surah */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-6 rounded-3xl shadow-md text-center space-y-3 relative overflow-hidden">
              <span className="text-xs uppercase tracking-widest bg-emerald-700/60 px-3 py-1 rounded-full">
                Surah Ke-{surah.nomor} • {surah.tempatTurun}
              </span>
              <h2 className="text-3xl font-serif">{surah.nama}</h2>
              <p className="text-xl font-bold">{surah.namaLatin}</p>
              <p className="text-xs text-emerald-100 max-w-lg mx-auto">
                "{surah.arti}"
              </p>
              {surah.nomor !== 1 && surah.nomor !== 9 && (
                <div className="pt-4 text-2xl font-serif text-emerald-200 border-t border-emerald-500/40 mt-3">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
              )}
            </div>

            {/* Daftar Ayat */}
            <div className="space-y-4">
              {surah.ayat.map((item) => {
                const isAudioPlaying = playingAudio === item.audio['01'];
                const isBookmarked = bookmarkedAyahs.includes(item.nomorAyat);

                return (
                  <div
                    key={item.nomorAyat}
                    id={`ayah-${item.nomorAyat}`}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 transition"
                  >
                    {/* Header Item Ayat (Nomor & Aksinya) */}
                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                      <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                        {item.nomorAyat}
                      </span>
                      <div className="flex items-center gap-2">
                        {/* Tombol Audio */}
                        <button
                          onClick={() => handlePlayAudio(item.audio['01'])}
                          className={`p-2 rounded-lg transition ${
                            isAudioPlaying
                              ? 'bg-amber-500 text-white'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700'
                          }`}
                          title="Putar Audio Ayat"
                        >
                          {isAudioPlaying ? <VolumeX className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
                        </button>

                        {/* Tombol Bookmark */}
                        <button
                          onClick={() => toggleBookmark(item.nomorAyat, item.teksArab, item.teksLatin)}
                          className={`p-2 rounded-lg transition ${
                            isBookmarked
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700'
                          }`}
                          title="Simpan Bookmark"
                        >
                          {isBookmarked ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Teks Arab */}
                    <div className="text-right py-2">
                      <p className="text-2xl sm:text-3xl font-serif leading-loose text-emerald-800 dark:text-emerald-300">
                        {item.teksArab}
                      </p>
                    </div>

                    {/* Transliterasi Latin */}
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 italic">
                      {item.teksLatin}
                    </p>

                    {/* Terjemahan Indonesia */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.teksIndonesia}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}