import React from 'react';
import { PollutantDetail } from '../types';
import { Gauge, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PollutantBreakdownGridProps {
  pollutants: PollutantDetail[];
}

export const PollutantBreakdownGrid: React.FC<PollutantBreakdownGridProps> = ({ pollutants }) => {
  const getStatusColor = (status: PollutantDetail['status']) => {
    switch (status) {
      case 'Good':
        return { text: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', badge: 'bg-emerald-500 text-black' };
      case 'Moderate':
        return { text: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/40', badge: 'bg-amber-500 text-black' };
      case 'Poor':
        return { text: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/40', badge: 'bg-orange-500 text-white' };
      case 'Unhealthy':
        return { text: 'text-rose-400', bg: 'bg-rose-500/15', border: 'border-rose-500/40', badge: 'bg-rose-500 text-white' };
      case 'Severe':
        return { text: 'text-purple-400', bg: 'bg-purple-950/60', border: 'border-purple-600/50', badge: 'bg-purple-600 text-white' };
    }
  };

  return (
    <div className="hud-panel rounded-3xl p-6 sm:p-7 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-md">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Multi-Gas & Particulate Pollutant Matrix
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                AQI.in Standard
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Live concentrations of 6 key ambient atmospheric pollutants against WHO safe exposure ceilings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real-time Continuous Gas Spectroscopy</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {pollutants.map((p) => {
          const style = getStatusColor(p.status);
          const ratio = (p.value / (p.whoThreshold || 1)).toFixed(1);
          const isExceeded = p.value > p.whoThreshold;

          return (
            <div
              key={p.code}
              className={`p-4 rounded-2xl border transition-all ${style.bg} ${style.border} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-400">{p.chemical}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${style.badge}`}>
                    {p.status}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-200 mt-1">{p.label}</h4>

                <div className="my-2.5">
                  <div className={`text-2xl font-black tracking-tight ${style.text}`}>
                    {p.value}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{p.unit}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 text-[10px] space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>WHO Max:</span>
                  <span className="font-mono font-semibold text-slate-300">{p.whoThreshold} {p.unit}</span>
                </div>
                {isExceeded && (
                  <div className="text-amber-400 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    <span>{ratio}x above threshold</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
