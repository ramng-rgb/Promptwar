import React from 'react';
import { 
  BarChart3, 
  Wind, 
  Leaf, 
  Activity, 
  Share2, 
  Award
} from 'lucide-react';
import { SustainableAction } from '../types';

interface ImpactDashboardProps {
  actions: SustainableAction[];
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({ actions }) => {
  const implementedActions = actions.filter(a => a.implemented);

  const totalPmOffsetGrams = implementedActions.reduce((acc, curr) => acc + curr.impactPmOffsetGrams, 0);
  const totalCo2SavedKg = implementedActions.reduce((acc, curr) => acc + curr.co2SavedKg, 0);
  
  // Real world equivalents:
  // 1 gram of PM2.5 prevented is equivalent to ~40 hours of clean lung breathing volume in hazardous smog.
  // 1 kg CO2 avoided is equivalent to ~5.5 km of gas car driving avoided.
  const cleanLungHours = Math.round(totalPmOffsetGrams * 3.5);
  const carKmEquivalent = (totalCo2SavedKg * 5.2).toFixed(1);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Direct Impact & Emission Offset Ledger</h3>
            <p className="text-xs text-slate-400">Real-time quantification of your family and community clean-air choices</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-300">
            {implementedActions.length} / {actions.length} Actions Adopted
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: PM2.5 Prevented */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Particulate Inhalation Averted</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-cyan-400 tracking-tight">
              {totalPmOffsetGrams} <span className="text-sm font-semibold text-slate-400">g</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">PM2.5 prevented from lungs & air pool</div>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-cyan-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (totalPmOffsetGrams / 350) * 100)}%` }} 
            />
          </div>
        </div>

        {/* Metric 2: CO2 Reduction */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Direct Carbon Avoided</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-emerald-400 tracking-tight">
              {totalCo2SavedKg.toFixed(1)} <span className="text-sm font-semibold text-slate-400">kg</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">CO₂ prevented from urban atmosphere</div>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (totalCo2SavedKg / 60) * 100)}%` }} 
            />
          </div>
        </div>

        {/* Metric 3: Clean Lung Breathing Hours */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Safe Air Breathing Equivalent</span>
            <Activity className="w-4 h-4 text-rose-400" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-rose-300 tracking-tight">
              {cleanLungHours} <span className="text-sm font-semibold text-slate-400">hrs</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Equivalent clean room protection volume</div>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-rose-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (cleanLungHours / 600) * 100)}%` }} 
            />
          </div>
        </div>

        {/* Metric 4: Tailpipe Mileage Offset */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>ICE Vehicle Mileage Equivalent</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-amber-300 tracking-tight">
              {carKmEquivalent} <span className="text-sm font-semibold text-slate-400">km</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Equivalent passenger car drive eliminated</div>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-amber-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (Number(carKmEquivalent) / 250) * 100)}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Community Multiplier Banner */}
      <div className="mt-4 p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-cyan-200">
          <span className="p-1 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">COMMUNITY POWER</span>
          <span>
            If <strong>1,000 neighborhood families</strong> implement your current action plan, your city stops <strong>{(totalPmOffsetGrams).toFixed(0)} kg of toxic PM2.5</strong> and <strong>{(totalCo2SavedKg).toFixed(0)} metric tons of CO₂</strong> this winter month.
          </span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(
              `Join our winter smog reduction pledge: I saved ${totalPmOffsetGrams}g of PM2.5 and ${totalCo2SavedKg.toFixed(1)}kg of CO2 today using AeroPulse Urban Air Assistant!`
            );
            alert('Community action pledge copied to clipboard! Share with your neighborhood group.');
          }}
          className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share Community Pledge
        </button>
      </div>
    </div>
  );
};
