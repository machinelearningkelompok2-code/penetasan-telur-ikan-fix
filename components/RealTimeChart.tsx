"use client";
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend
} from 'recharts';

interface RealTimeChartProps {
  data: any[];
}

export const RealTimeChart = ({ data }: RealTimeChartProps) => {
  return (
    <div className="glass p-6 min-h-[400px] flex flex-col">
      <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
        Tren Sensor Real-time
      </h3>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSuhu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPH" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="waktu" 
              stroke="#64748b" 
              fontSize={11}
              tickFormatter={(val) => new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            />
            {/* Sumbu Kiri: Untuk Suhu & pH */}
            <YAxis 
              yAxisId="left"
              stroke="#64748b" 
              fontSize={11} 
              domain={[0, 45]}
              tickFormatter={(val) => val.toFixed(0)}
            />
            {/* Sumbu Kanan: Untuk Kekeruhan */}
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#6366f1" 
              fontSize={11} 
              domain={[0, 110]}
              tickFormatter={(val) => val.toFixed(0)}
            />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }}
            itemStyle={{ padding: '2px 0' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
          <Area 
            yAxisId="left"
            type="monotone" 
            name="Suhu Air (°C)"
            dataKey="suhu" 
            stroke="#f97316" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorSuhu)" 
          />
          <Area 
            yAxisId="left"
            type="monotone" 
            name="Derajat pH"
            dataKey="ph" 
            stroke="#0ea5e9" 
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorPH)"
          />
          <Area 
            yAxisId="right"
            type="monotone" 
            name="Kekeruhan (NTU)"
            dataKey="kekeruhan" 
            stroke="#6366f1" 
            strokeWidth={3}
            fillOpacity={0}
          />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
};
