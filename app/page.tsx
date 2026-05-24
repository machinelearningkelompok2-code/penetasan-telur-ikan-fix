"use client";
import React, { useEffect, useState } from 'react';
import { Thermometer, Droplets, Waves, LayoutDashboard, Settings, Bell, Fish } from 'lucide-react';
import Link from 'next/link';
import { MetricsCard } from '@/components/MetricsCard';
import { RealTimeChart } from '@/components/RealTimeChart';
import { PredictionPanel } from '@/components/PredictionPanel';

export default function Dashboard() {
  const [data, setData] = useState<any>({ sensors: [], latest: null });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      const json = await res.json();
      setData(json);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Polling every 5s
    return () => clearInterval(interval);
  }, []);

  const latestSensor = data.realtime || { suhu: 0, ph: 0, kekeruhan: 0 };

  // Helper untuk hitung persentase kualitas tiap sensor (Rumus Ilmiah Gaussian)
  const calculateSuhuScore = (val: number) => {
    // Kurva Bell terpusat di 27.5
    return 100 * Math.exp(-Math.pow(val - 27.5, 2) / (2 * Math.pow(4.0, 2)));
  };

  const calculatePHScore = (val: number) => {
    // Kurva Bell terpusat di 7.5
    return 100 * Math.exp(-Math.pow(val - 7.5, 2) / (2 * Math.pow(2.0, 2)));
  };

  const calculateTurbScore = (val: number) => {
    // Logistik Sigmoid
    return 100 / (1 + Math.exp(-(val - 50) / 10));
  };

  // Helper untuk ulasan cerdas AI (Bahasa Mahasiswa Ilmiah)
  const getAIReview = () => {
    const reviews = [];
    const { suhu, ph, kekeruhan } = latestSensor;
    const isGagal = data.latest?.status_keberhasilan?.includes('Gagal');

    // --- ANALISIS PARAMETER (Journal Based) ---
    if (suhu < 25) {
      reviews.push("Suhu terlalu dingin bikin metabolisme embrio jadi lambat, efeknya waktu penetasan bakal lebih lama.");
    } else if (suhu > 30) {
      reviews.push("Suhu air yang ketinggian bisa ngurangin kadar oksigen dan memicu pertumbuhan jamur di telur.");
    }

    if (ph < 6.5) {
      reviews.push("Kondisi air yang terlalu asam berisiko ngerusak cangkang (chorion) telur dan bikin embrio di dalamnya mati.");
    } else if (ph > 8.5) {
      reviews.push("Air yang terlalu basa bisa memicu racun amonia yang berbahaya banget buat pertumbuhan organ telur.");
    }

    if (kekeruhan < 60) {
      reviews.push("Air yang keruh punya banyak endapan yang bisa nutupin pori-pori telur, jadi embrio susah dapet oksigen.");
    }

    // --- ANALISIS LAJU PENETASAN ---
    if (isGagal) {
      reviews.push("AI mendeteksi ada parameter yang lewat batas fatal, jadi proses perkembangan embrio terhenti.");
    } else {
      if (suhu > 28) reviews.push("Laju penetasan jadi lebih cepet karena suhu hangat memacu pembelahan sel embrio secara progresif.");
      else if (suhu < 26) reviews.push("Perkembangan embrio melambat karena suhu rendah nurunin aktivitas enzim di dalam telur.");
      else reviews.push("Kondisi lingkungan stabil banget, cocok buat penetasan yang seragam dan sehat.");
    }

    if (reviews.length === 0) return "Mantap! Semua parameter lingkungan ada di titik ideal sesuai standar jurnal perikanan.";
    return reviews.join(" ");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 glass m-4 mr-0 hidden md:flex flex-col items-center lg:items-start p-6 space-y-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Fish className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white hidden lg:block">Aqualyze AI</h1>
        </div>

        <nav className="flex-1 space-y-2 w-full">
          <Link href="/">
            <div className="bg-blue-600/20 text-blue-400 p-3 rounded-xl flex items-center gap-3 cursor-pointer">
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-semibold hidden lg:block">Beranda</span>
            </div>
          </Link>
          <Link href="/alerts">
            <div className="text-slate-400 p-3 rounded-xl flex items-center gap-3 hover:bg-slate-800 transition cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="font-semibold hidden lg:block">Riwayat Anomali</span>
            </div>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 space-y-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">Monitoring Penetasan</h2>
            <p className="text-slate-400">Sistem Prediksi IoT Terintegrasi (Random Forest & LSTM)</p>
          </div>
          <div className="glass px-4 py-2 flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-emerald-400">Server Lokal Terhubung</span>
          </div>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricsCard
            title="Suhu Air"
            value={latestSensor.suhu}
            unit="°C"
            icon={Thermometer}
            color="bg-orange-500"
            score={calculateSuhuScore(latestSensor.suhu)}
            description={
              latestSensor.suhu >= 25 && latestSensor.suhu <= 30 ? "Kondisi Ideal" :
              latestSensor.suhu >= 20 && latestSensor.suhu <= 35 ? "Kurang Stabil" : "Suhu Ekstrem"
            }
          />
          <MetricsCard
            title="Derajat Keasaman"
            value={latestSensor.ph}
            unit="pH"
            icon={Droplets}
            color="bg-sky-500"
            score={calculatePHScore(latestSensor.ph)}
            description={
              latestSensor.ph >= 6.5 && latestSensor.ph <= 8.5 ? "pH Optimal" :
              latestSensor.ph >= 5.0 && latestSensor.ph <= 10.0 ? "pH Berisiko" : "pH Fatal"
            }
          />
          <MetricsCard
            title="Kekeruhan"
            value={latestSensor.kekeruhan}
            unit="NTU"
            icon={Waves}
            color="bg-indigo-500"
            score={calculateTurbScore(latestSensor.kekeruhan)}
            description={
              latestSensor.kekeruhan > 60 ? "Air Jernih" :
              latestSensor.kekeruhan > 30 ? "Agak Keruh" : "Sangat Keruh"
            }
          />
        </div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <RealTimeChart data={data.sensors} />
          </div>
          <div className="xl:col-span-1">
            <PredictionPanel 
              prediction={data.latest} 
              review={getAIReview()}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
