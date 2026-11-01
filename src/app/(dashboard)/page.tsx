'use client';

import React, { useState } from 'react';
import { Sparkles, MapPin, Clock, ShoppingBag, BookOpen, Compass, ChevronRight, Star } from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string;
  rating: number;
}

// Mock data awal untuk tampilan UI sebelum terhubung ke data real-time Supabase
const FEATURED_MENUS: FoodItem[] = [
  {
    id: '1',
    name: 'Nasi Mandhi Kambing Special',
    category: 'Kuliner Timur Tengah',
    price: 55000,
    image_url: 'https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=500&q=80',
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Ayam Bakar Madu Berkah',
    category: 'Menu Nusantara',
    price: 32000,
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80',
    rating: 4.8,
  },
];

export default function DashboardPage() {
  const [currentPrayer] = useState({ name: 'Dzuhur', time: '12:04' });
  const [countdown] = useState('02:15:40');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-24 transition-colors duration-300">
      {/* Header / Hero Section */}
      <header className="bg-emerald-600 dark:bg-emerald-900 text-white px-4 pt-6 pb-12 rounded-b-3xl shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center mb-6">
          <div>
            <span className="text-xs uppercase tracking-wider bg-emerald-700 dark:bg-emerald-800 px-3 py-1 rounded-full font-medium">
              miffhood27 PWA
            </span>
            <h1 className="text-2xl font-bold mt-2">Ahlan wa Sahlan, Sahabat ✨</h1>
          </div>
          <div className="flex items-center gap-2 bg-emerald-700/50 dark:bg-emerald-800/50 px-3 py-2 rounded-2xl backdrop-blur-sm">
            <MapPin className="w-4 h-4 text-emerald-200" />
            <span className="text-sm font-medium">Jakarta, ID</span>
          </div>
        </div>

        {/* Widget Jadwal Sholat Terdekat */}
        <div className="max-w-4xl mx-auto bg-white/10 dark:bg-slate-900/40 border border-white/20 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Clock className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <p className="text-xs text-emerald-100">Menuju Sholat {currentPrayer.name}</p>
              <p className="text-lg font-bold">{currentPrayer.time} WIB</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-emerald-200 block">Sisa Waktu</span>
            <span className="text-sm font-mono font-semibold bg-emerald-800/40 px-2.5 py-1 rounded-lg">
              {countdown}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-4 -mt-6 space-y-6">
        {/* Quick Access Menu / Modul Islami Shortcuts */}
        <section className="grid grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <a href="/islamic/quran" className="flex flex-col items-center gap-1.5 group">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-105 transition">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-center">Al-Qur'an</span>
          </a>
          <a href="/islamic/doa" className="flex flex-col items-center gap-1.5 group">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl group-hover:scale-105 transition">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-center">Do'a Harian</span>
          </a>
          <a href="/islamic/sholat" className="flex flex-col items-center gap-1.5 group">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-105 transition">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-center">Panduan Sholat</span>
          </a>
          <a href="/islamic/kiblat" className="flex flex-col items-center gap-1.5 group">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-105 transition">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-center">Kiblat</span>
          </a>
        </section>

        {/* Banner Promo Kuliner */}
        <section className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="bg-white/20 text-xs font-semibold px-2.5 py-0.5 rounded-full">Spesial Hari Ini</span>
            <h2 className="text-xl font-bold">Diskon Berkah s.d 25%</h2>
            <p className="text-xs text-amber-100">Nikmati hidangan lezat siap antar ke tempat Anda.</p>
          </div>
          <a href="/menu" className="bg-white text-orange-600 hover:bg-amber-50 font-semibold px-4 py-2.5 rounded-xl text-sm shadow transition flex items-center gap-1 shrink-0">
            Pesan <ChevronRight className="w-4 h-4" />
          </a>
        </section>

        {/* Katalog Menu Unggulan */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Menu Kuliner Unggulan</h3>
            <a href="/menu" className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
              Lihat Semua
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURED_MENUS.map((item) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full">
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.rating}</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-1">
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{item.category}</span>
                    <h4 className="font-bold text-base line-clamp-1">{item.name}</h4>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Rp {item.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-sm">
                    <ShoppingBag className="w-4 h-4" /> Tambah ke Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}