'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  ArrowLeft,
  MapPin,
  Clock,
  Navigation,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

function calculateQiblaDirection(lat: number, lng: number): number {
  const phiK = (KAABA_LAT * Math.PI) / 180.0;
  const lambdaK = (KAABA_LNG * Math.PI) / 180.0;
  const phi = (lat * Math.PI) / 180.0;
  const lambda = (lng * Math.PI) / 180.0;

  const psi =
    (180.0 / Math.PI) *
    Math.atan2(
      Math.sin(lambdaK - lambda),
      Math.cos(phi) * Math.tan(phiK) -
        Math.sin(phi) * Math.cos(lambdaK - lambda)
    );

  return Math.round((psi + 360) % 360);
}

export default function KiblatPage() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [qiblaAngle, setQiblaAngle] = useState<number>(295); // Default arah Kiblat Indonesia (~295°)
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [compassSupported, setCompassSupported] = useState<boolean>(false);
  const [permissionNeeded, setPermissionNeeded] = useState<boolean>(false);

  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [dateHijri, setDateHijri] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Ambil Lokasi GPS & Jadwal Sholat
  const fetchLocationAndPrayers = () => {
    setLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Browser tidak mendukung deteksi lokasi GPS.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });

        const angle = calculateQiblaDirection(lat, lng);
        setQiblaAngle(angle);

        try {
          // Ambil jadwal sholat metode Kemenag RI (method=20)
          const res = await fetch(
            `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=20`
          );
          const json = await res.json();
          if (json?.data) {
            setPrayerTimes(json.data.timings);
            const hijri = json.data.date?.hijri;
            if (hijri) {
              setDateHijri(
                `${hijri.day} ${hijri.month.en} ${hijri.year} H`
              );
            }
          }
        } catch (err) {
          console.error('Gagal memuat jadwal sholat:', err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        setLocationError(
          'Izin lokasi ditolak. Aktifkan GPS untuk menghitung sudut Kiblat & jadwal sholat akurat.'
        );
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    fetchLocationAndPrayers();

    // Cek dukungan sensor kompas (DeviceOrientation)
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      const DeviceOrientationEventTyped =
        DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<'granted' | 'denied'>;
        };

      if (typeof DeviceOrientationEventTyped.requestPermission === 'function') {
        setPermissionNeeded(true);
      } else {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  const handleOrientation = (event: DeviceOrientationEvent) => {
    const webkitHeading = (
      event as DeviceOrientationEvent & { webkitCompassHeading?: number }
    ).webkitCompassHeading;

    if (typeof webkitHeading === 'number') {
      setDeviceHeading(Math.round(webkitHeading));
      setCompassSupported(true);
    } else if (event.alpha !== null) {
      // Android / standar browser
      const heading = Math.round((360 - event.alpha) % 360);
      setDeviceHeading(heading);
      setCompassSupported(true);
    }
  };

  const requestCompassPermission = async () => {
    const DeviceOrientationEventTyped =
      DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };

    if (typeof DeviceOrientationEventTyped.requestPermission === 'function') {
      try {
        const response = await DeviceOrientationEventTyped.requestPermission();
        if (response === 'granted') {
          setPermissionNeeded(false);
          window.addEventListener('deviceorientation', handleOrientation, true);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Sudut putar jarum kompas relatif terhadap arah hadap HP
  const needleRotation = compassSupported
    ? (qiblaAngle - deviceHeading + 360) % 360
    : qiblaAngle;

  // Cek apakah sudah menghadap Kiblat (toleransi ±5 derajat)
  const isAligned =
    compassSupported &&
    (needleRotation <= 5 || needleRotation >= 355);

  const prayerList = prayerTimes
    ? [
        { name: 'Subuh', time: prayerTimes.Fajr },
        { name: 'Terbit', time: prayerTimes.Sunrise },
        { name: 'Dzuhur', time: prayerTimes.Dhuhr },
        { name: 'Ashar', time: prayerTimes.Asr },
        { name: 'Maghrib', time: prayerTimes.Maghrib },
        { name: 'Isya', time: prayerTimes.Isha },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-24 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-teal-600 dark:bg-teal-900 text-white px-4 py-4 shadow-md backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-teal-700/50 hover:bg-teal-700 transition"
              aria-label="Kembali ke Beranda"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Compass className="w-5 h-5 text-teal-200" />
                Arah Kiblat &amp; Jadwal Sholat
              </h1>
              <p className="text-xs text-teal-100">
                {dateHijri || 'Penentu arah Ka\'bah & waktu sholat'}
              </p>
            </div>
          </div>

          <button
            onClick={fetchLocationAndPrayers}
            className="p-2.5 rounded-xl bg-teal-700/60 hover:bg-teal-700 transition"
            title="Perbarui Lokasi GPS"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Peringatan jika GPS ditolak */}
        {locationError && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-amber-800 dark:text-amber-300">
                Lokasi GPS Belum Aktif
              </p>
              <p className="text-amber-700 dark:text-amber-400">{locationError}</p>
            </div>
          </div>
        )}

        {/* Kartu Kompas Kiblat */}
        <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center space-y-5">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-full">
            <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            {coords ? (
              <span>
                {coords.lat.toFixed(4)}°, {coords.lng.toFixed(4)}°
              </span>
            ) : (
              <span>Mendeteksi koordinat lokasi...</span>
            )}
          </div>

          {/* Lingkaran Kompas */}
          <div className="relative w-64 h-64 flex items-center justify-center my-2">
            {/* Ring Luar */}
            <div
              className={`w-full h-full rounded-full border-8 transition-colors duration-300 flex items-center justify-center relative shadow-inner ${
                isAligned
                  ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
              }`}
            >
              {/* Penanda Mata Angin */}
              <span className="absolute top-2.5 text-xs font-bold text-rose-500">
                U
              </span>
              <span className="absolute bottom-2.5 text-xs font-bold text-slate-400">
                S
              </span>
              <span className="absolute right-3 text-xs font-bold text-slate-400">
                T
              </span>
              <span className="absolute left-3 text-xs font-bold text-slate-400">
                B
              </span>

              {/* Jarum Penunjuk Kiblat */}
              <div
                className="w-44 h-44 flex items-center justify-center transition-transform duration-200 ease-out"
                style={{ transform: `rotate(${needleRotation}deg)` }}
              >
                <div className="flex flex-col items-center -mt-12">
                  <div
                    className={`p-2 rounded-full shadow-md ${
                      isAligned
                        ? 'bg-emerald-500 text-white'
                        : 'bg-teal-600 text-white'
                    }`}
                  >
                    <Navigation className="w-6 h-6 fill-current" />
                  </div>
                  <div
                    className={`w-1.5 h-16 rounded-full ${
                      isAligned ? 'bg-emerald-500' : 'bg-teal-600'
                    }`}
                  />
                </div>
              </div>

              {/* Titik Tengah */}
              <div className="w-4 h-4 rounded-full bg-slate-800 dark:bg-slate-200 border-2 border-white dark:border-slate-900 absolute" />
            </div>
          </div>

          {/* Info Derajat & Status */}
          <div className="space-y-1.5">
            <p className="text-2xl font-extrabold text-teal-700 dark:text-teal-400">
              {qiblaAngle}° <span className="text-sm font-medium text-slate-500">dari Utara</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              {isAligned
                ? 'Posisi perangkat sudah menghadap tepat ke arah Kiblat.'
                : compassSupported
                ? 'Putar perangkat secara mendatar hingga panah mengarah lurus ke atas.'
                : 'Arahkan perangkat ke sudut ' + qiblaAngle + '° Barat Laut menggunakan kompas.'}
            </p>
          </div>

          {/* Tombol Izin Sensor Kompas (Khusus iOS / Safari) */}
          {permissionNeeded && (
            <button
              onClick={requestCompassPermission}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              Aktifkan Sensor Kompas Perangkat
            </button>
          )}
        </section>

        {/* Bagian Jadwal Sholat Harian */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Jadwal Sholat Hari Ini
            </h2>
            <span className="text-[11px] text-slate-400">Metode Kemenag RI</span>
          </div>

          {loading ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400">
              Memuat jadwal sholat sesuai lokasi...
            </div>
          ) : prayerList.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-400">
              Jadwal sholat tidak tersedia. Pastikan koneksi internet dan izin lokasi aktif.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {prayerList.map((item) => (
                <div
                  key={item.name}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm"
                >
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {item.name}
                  </span>
                  <span className="text-base font-bold text-teal-600 dark:text-teal-400 font-mono">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}