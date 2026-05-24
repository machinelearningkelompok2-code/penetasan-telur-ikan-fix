import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  color: string;
  description?: string;
  score?: number;
}

export const MetricsCard = ({ title, value, unit, icon: Icon, color, description, score }: MetricsCardProps) => {
  return (
    <div className="glass glass-hover p-6 flex items-center gap-5 relative overflow-hidden">
      {score !== undefined && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-white/10 text-[10px] font-black text-white/40 rounded-bl-xl border-b border-l border-white/5 uppercase tracking-widest">
          Skor Kualitas: {score.toFixed(0)}%
        </div>
      )}
      <div className={`p-4 rounded-2xl ${color} bg-opacity-20`}>
        <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div className="flex-1">
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-white leading-tight">
          {typeof value === 'number' ? value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : value} 
          <span className="text-lg font-normal text-slate-500 ml-1">{unit}</span>
        </h3>
        {description && (
          <p className="text-[10px] font-semibold text-slate-500 mt-1 uppercase tracking-wider italic">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
