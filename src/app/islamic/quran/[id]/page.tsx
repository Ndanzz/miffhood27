'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';

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
  ayat: Ayah[];
}

export default function DetailSurahPage({ params }: { params: { id: string } }) {
  const surahId = params.id;
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function fetchSurahDetail() {
      try {
        const res = await fetch(`https://equran.id/api/v2/surat/${surahId}`);
        const data = await res.json();
        setSurah(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (surahId) fetchSurahDetail();
  }, [surahId]);

  const handlePlayAudio = (url: string) => {
    if (audioObj) audioObj.pause();

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-24">
      <header className="sticky top-0 z-10 bg-emerald-600 dark:bg-emerald-900 text-white px-4 py-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <a href="/islamic/quran" className="p-2 rounded-xl bg-emerald-700/50">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <h1 className="text-lg font-bold">{surah ? surah.namaLatin : 'Memuat...'}</h1>
        </div>
        {surah && <span className="text-2xl font-serif">{surah.nama}</span>}
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-4">
        {loading ? (
          <div className="py-20 text-center text-sm text-slate-500">Memuat ayat...</div>
        ) : (
          surah?.ayat.map((item) => (
            <div key={item.nomorAyat} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  {item.nomorAyat}
                </span>
                <button
                  onClick={() => handlePlayAudio(item.audio['01'])}
                  className="p-2 bg-white dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300"
                >
                  {playingAudio === item.audio['01'] ? <VolumeX className="w-4 h-4 text-amber-500" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-right text-2xl font-serif leading-loose text-emerald-800 dark:text-emerald-300">{item.teksArab}</p>
              <p className="text-sm text-emerald-600 italic">{item.teksLatin}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{item.teksIndonesia}</p>
            </div>
          ))
        )}
      </main>
    </div>
  );
}