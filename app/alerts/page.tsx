"use client";
import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  Clock,
  Thermometer,
  Droplets,
  Waves,
  Fish,
  Bell,
  LayoutDashboard,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { MetricsCard } from '@/components/MetricsCard';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts');
      const data = await res.json();
      setAlerts(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch alerts", err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, []);

  // Hitung statistik anomali
  const stats = {
    suhu: alerts.filter(a => a.suhu < 25 || a.suhu > 30).length,
    ph: alerts.filter(a => a.ph < 6.5 || a.ph > 8.5).length,
    kekeruhan: alerts.filter(a => a.kekeruhan <= 60).length
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Consistent with Dashboard */}
      <aside className="w-20 lg:w-64 glass m-4 mr-0 hidden md:flex flex-col items-center lg:items-start p-6 space-y-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <Fish className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white hidden lg:block">Aqualyze AI</h1>
        </div>

        <nav className="flex-1 space-y-2 w-full">
          <Link href="/">
            <div className="text-slate-400 p-3 rounded-xl flex items-center gap-3 hover:bg-slate-800 transition cursor-pointer">
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-semibold hidden lg:block">Beranda</span>
            </div>
          </Link>
          <Link href="/alerts">
            <div className="bg-blue-600/20 text-blue-400 p-3 rounded-xl flex items-center gap-3 cursor-pointer">
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
            <div className="flex items-center gap-2 mb-1">
              <Link href="/" className="text-blue-400 hover:text-blue-300 transition md:hidden">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h2 className="text-3xl font-bold text-white">Riwayat Anomali</h2>
            </div>
            <p className="text-slate-400">Log anomali sensor dan deteksi dini kegagalan sistem</p>
          </div>
          <div className="glass px-4 py-2 flex items-center gap-3 border-rose-500/20 border">
            <div className={`w-2 h-2 ${alerts.length > 0 ? 'bg-rose-500' : 'bg-emerald-500'} rounded-full animate-pulse`} />
            <span className={`text-sm font-medium ${alerts.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {alerts.length} Total Anomali Terdeteksi
            </span>
          </div>
        </header>

        {/* Anomaly Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricsCard
            title="Anomali Suhu"
            value={stats.suhu}
            unit="Peringatan"
            icon={Thermometer}
            color="bg-orange-500"
          />
          <MetricsCard
            title="Anomali pH"
            value={stats.ph}
            unit="Peringatan"
            icon={Droplets}
            color="bg-sky-500"
          />
          <MetricsCard
            title="Anomali Kekeruhan"
            value={stats.kekeruhan}
            unit="Peringatan"
            icon={Waves}
            color="bg-indigo-500"
          />
        </div>

        {/* Content List */}
        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass p-6 h-32 animate-pulse opacity-50" />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="glass p-20 text-center space-y-4">
            <div className="bg-emerald-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <ShieldAlert className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Sistem Optimal</h2>
            <p className="text-slate-400">Semua parameter saat ini berada dalam batas normal.</p>
          </div>
        ) : (
          <div className="grid gap-4 pb-10">
            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4" /> Anomali Terbaru
            </h3>
            {alerts.map((alert, idx) => (
              <div key={idx} className="glass glass-hover p-6 border-l-4 border-rose-500 relative overflow-hidden group transition-all duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  <AlertTriangle className="w-32 h-32 text-rose-500" />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-slate-500 text-sm">
                      <span className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(alert.waktu).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(alert.waktu).toLocaleTimeString()}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors">
                      {alert.status_keberhasilan && alert.status_keberhasilan.includes('Gagal') ? 'Prediksi Gagal (AI Detection)' : 'Parameter Anomali'}
                    </h3>

                    <div className="flex flex-wrap gap-3">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${alert.suhu < 25 || alert.suhu > 30 ? 'border-rose-500/50 bg-rose-500/10 text-rose-400' : 'border-slate-700 bg-slate-800/50 text-slate-400'}`}>
                        <Thermometer className="w-4 h-4" />
                        {alert.suhu}°C {alert.suhu < 20 || alert.suhu > 35 ? "(Fatal)" : "(Berisiko)"}
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${alert.ph < 6.5 || alert.ph > 8.5 ? 'border-rose-500/50 bg-rose-500/10 text-rose-400' : 'border-slate-700 bg-slate-800/50 text-slate-400'}`}>
                        <Droplets className="w-4 h-4" />
                        pH {alert.ph} {alert.ph < 5.0 || alert.ph > 10.0 ? "(Fatal)" : "(Berisiko)"}
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${alert.kekeruhan <= 60 ? 'border-rose-500/50 bg-rose-500/10 text-rose-400' : 'border-slate-700 bg-slate-800/50 text-slate-400'}`}>
                        <Waves className="w-4 h-4" />
                        {alert.kekeruhan} NTU {
                          alert.kekeruhan > 60 ? "(Air Jernih)" : 
                          alert.kekeruhan >= 30 ? "(Agak Keruh)" : "(Sgt Keruh)"
                        }
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end justify-center gap-1">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Peluang Berhasil</div>
                    <div className="text-4xl font-black text-white">{alert.probabilitas}%</div>
                    <div className="bg-blue-500/10 text-blue-400 text-[10px] font-black px-2.5 py-1 rounded-full border border-blue-500/20 uppercase tracking-tighter">
                      Analisis AI
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
