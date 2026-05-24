import React from 'react';
import { StatusBadge } from './StatusBadge';
import { Timer, Zap, Target } from 'lucide-react';

interface PredictionPanelProps {
  prediction: {
    status_keberhasilan: string;
    estimasi_waktu_tetas: number;
    probabilitas: number;
  } | null;
  review?: string;
}

export const PredictionPanel = ({ prediction, review }: PredictionPanelProps) => {
  if (!prediction) return <div className="glass p-6 text-slate-400">Menunggu data prediksi...</div>;

  return (
    <div className="glass p-8 space-y-8 relative overflow-hidden flex flex-col h-full">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Zap className="w-24 h-24 text-yellow-400" />
      </div>
      
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">Status Kecerdasan AI</p>
          <StatusBadge status={prediction.status_keberhasilan} />
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-sm font-medium mb-1">Tingkat Keyakinan</p>
          <div className="text-2xl font-bold text-white flex items-center justify-end gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            {prediction.probabilitas.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="pt-4">
        <p className="text-slate-400 text-sm font-medium mb-4 flex items-center gap-2">
          <Timer className="w-4 h-4 text-purple-400" />
          ESTIMASI WAKTU PENETASAN (AI)
        </p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-6xl font-black text-white tracking-tighter">
            {prediction.estimasi_waktu_tetas.toFixed(1)}
          </h2>
          <span className="text-2xl font-bold text-slate-500 uppercase">Jam</span>
        </div>
      </div>

      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-1000"
          style={{ width: `${prediction.probabilitas}%` }}
        />
      </div>

      {/* Bagian Ulasan AI */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">Ulasan Pakar AI</p>
        <p className="text-sm text-slate-300 leading-relaxed italic font-medium">
          "{review || "AI sedang menganalisis kestabilan parameter..."}"
        </p>
      </div>
    </div>
  );
};
