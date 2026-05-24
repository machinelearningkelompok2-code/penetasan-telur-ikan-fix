import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatusBadgeProps {
  status: 'Berhasil' | 'Gagal' | string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const isSuccess = status.startsWith('Berhasil');
  
  return (
    <div className={cn(
      "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse",
      isSuccess 
        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50" 
        : "bg-rose-500/20 text-rose-400 border border-rose-500/50"
    )}>
      {status}
    </div>
  );
};
